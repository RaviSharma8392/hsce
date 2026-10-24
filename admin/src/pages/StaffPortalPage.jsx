import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Megaphone,
  GraduationCap,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  LogOut,
  Save,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Menu,
  X,
  Users,
  Calendar,
  ClipboardList,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import { updatePassword } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, firebaseReady } from "../config/firebase";
import AddNoticeModal from "../components/AddNoticeModal";
import EnquiriesPage from "./EnquiriesPage";
import GalleryPage from "./GalleryPage";
import SyllabusPage from "./SyllabusPage";
import { subscribeToEnquiries } from "../services/enquiryService";

const COLLEGE_LOGO_URL = "/assets/brand/college-logo.png";

export default function StaffPortalPage({
  user,
  logout,
  role,
  permissions = {},
}) {
  const isPrincipal = role === "principal";
  const canManageNotices = isPrincipal || permissions.notices === true;
  const canManageGallery = isPrincipal || permissions.gallery === true;
  const canManageSyllabus =
    isPrincipal ||
    Object.values(permissions).some((enabled) => enabled === true);
  const manageContentPath =
    isPrincipal || permissions.notices
      ? "/manage/notices"
      : "/manage/gallery";

  // ONLY 3 BUTTONS / TABS:
  // 1: 'profile' (Manage Profile)
  // 2: 'latest-notice' (Upload Latest Notice)
  // 3: 'admission-notice' (Upload Admission Notice)
  const [activeTab, setActiveTab] = useState("profile");

  // User menu dropdown & Hamburger Drawer
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Modal states for notice creation & editing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState("latest"); // 'latest' or 'admission'
  const [noticeToEdit, setNoticeToEdit] = useState(null);

  // Notification Banner
  const [bannerMessage, setBannerMessage] = useState("");

  // Student Chatbot Enquiries Count
  const [unreadEnquiryCount, setUnreadEnquiryCount] = useState(0);

  useEffect(() => {
    const unsub = subscribeToEnquiries((list) => {
      const unread = list.filter((e) => e.status === "new" || !e.status).length;
      setUnreadEnquiryCount(unread);
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // =========================================================================
  // 1. SIMPLE PROFILE STATE
  // =========================================================================
  const profileStorageKey = isPrincipal
    ? "hsce_principal_profile"
    : "hsce_staff_profile";

  const defaultProfile = useMemo(() => {
    if (isPrincipal) {
      return {
        name: "Dr. Savita Rathee",
        designation: "Principal",
        employeeId: "HSCE-DIR-2024-01",
        department: "Institutional Leadership",
        email: user?.email || "",
        phone: "+91 98112 00001",
        qualification: "Ph.D. (Education), M.Ed., UGC-NET",
        bio: "Principal at Haryana Shakti College of Education leading academic excellence and NCTE governance.",
        principalAddress:
          "Haryana Shakti College of Education is dedicated to fostering academic excellence, high ethical standards, and holistic teacher education.",
      };
    }
    return {
      name: "Suman Sharma",
      designation: "Teacher",
      employeeId: "HSCE-TCH-2024-04",
      department: "Pedagogy & Teacher Education",
      email: user?.email || "suman.sharma@hsce.edu.in",
      phone: "+91 98112 45890",
      qualification: "M.Ed., M.A. (English), UGC-NET",
      bio: "Teacher educator at Haryana Shakti College of Education specializing in pedagogical methods.",
    };
  }, [isPrincipal, user?.email]);

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem(profileStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not read saved profile", e);
    }
    return defaultProfile;
  });

  const [profileForm, setProfileForm] = useState(profileData);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profile form when profileData updates
  useEffect(() => {
    setProfileForm(profileData);
  }, [profileData]);

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSavingProfile(true);

    // Validate new password if entered
    if (newPassword) {
      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        setSavingProfile(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        setSavingProfile(false);
        return;
      }
    }

    try {
      // 1. Update Name and Mobile Number only
      const updated = {
        ...profileData,
        name: profileForm.name?.trim() || profileData.name,
        phone: profileForm.phone?.trim() || profileData.phone,
      };

      localStorage.setItem(profileStorageKey, JSON.stringify(updated));
      setProfileData(updated);

      // 2. Sync to Firestore
      if (firebaseReady) {
        try {
          const docId = isPrincipal ? "principal" : user?.uid || "staff";
          await setDoc(
            doc(db, isPrincipal ? "principalProfiles" : "staffProfiles", docId),
            {
              name: updated.name,
              phone: updated.phone,
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          );
        } catch (dbErr) {
          console.warn("Firestore profile sync:", dbErr.message);
        }
      }

      // 3. Update password in Firebase Auth if provided
      let pwdChanged = false;
      if (newPassword && auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, newPassword);
          pwdChanged = true;
          setNewPassword("");
          setConfirmPassword("");
        } catch (authErr) {
          console.warn("Password change error:", authErr);
          if (authErr.code === "auth/requires-recent-login") {
            setPasswordError("Please log in again to change password.");
            setSavingProfile(false);
            return;
          }
          setPasswordError(authErr.message || "Failed to update password.");
          setSavingProfile(false);
          return;
        }
      }

      setBannerMessage(
        pwdChanged
          ? "Profile details & password updated successfully!"
          : "Profile details updated successfully!",
      );
      setTimeout(() => setBannerMessage(""), 3500);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  // =========================================================================
  // 2. DIRECT DATA FETCHING FOR NOTICES (NO COMPLICATED FILTERS)
  // =========================================================================
  const [noticesList, setNoticesList] = useState([]);

  // Direct Firestore Sync: Always fetches all notices so published notices are visible to everyone
  useEffect(() => {
    if (!firebaseReady || !canManageNotices) return;
    const unsub = onSnapshot(
      query(
        collection(db, "notices"),
        orderBy("createdAt", "desc"),
        limit(100),
      ),
      (snap) => {
        setNoticesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.warn("Firestore notice fetch:", err.message);
      },
    );
    return () => unsub();
  }, [canManageNotices]);

  // Notice Created Callback
  const handleNoticeCreated = (newNotice) => {
    setNoticesList((prev) => [newNotice, ...prev]);
    setBannerMessage(`Notice published successfully!`);
    setTimeout(() => setBannerMessage(""), 3500);
  };

  // Notice Updated Callback
  const handleNoticeUpdated = (updated) => {
    setNoticesList((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n)),
    );
    setBannerMessage("Notice changes saved successfully!");
    setTimeout(() => setBannerMessage(""), 3500);
    setNoticeToEdit(null);
  };

  // Open Edit Notice Modal
  const handleOpenEditNotice = (notice) => {
    setNoticeToEdit(notice);
    setModalType(notice.type === "admission" ? "admission" : "latest");
    setIsAddModalOpen(true);
  };

  // Hide or Show Notice (Toggle Visibility)
  const handleToggleVisibility = async (noticeId) => {
    if (!canManageNotices) return;
    const target = noticesList.find((n) => n.id === noticeId);
    if (!target) return;
    const newPublished = target.isPublished === false ? true : false;

    try {
      await setDoc(
        doc(db, "notices", noticeId),
        {
          isPublished: newPublished,
          status: newPublished ? "published" : "draft",
          publishedAt: newPublished
            ? serverTimestamp()
            : typeof target.publishedAt?.toDate === "function"
              ? target.publishedAt
              : null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (err) {
      setBannerMessage(err.message || "Could not update notice visibility.");
      return;
    }

    const updated = noticesList.map((n) =>
      n.id === noticeId ? { ...n, isPublished: newPublished } : n,
    );
    setNoticesList(updated);
    setBannerMessage(
      newPublished
        ? "Notice is now Visible to students & public."
        : "Notice is now Hidden from public view.",
    );
    setTimeout(() => setBannerMessage(""), 3000);
  };

  // Delete Notice
  const handleDeleteNotice = async (noticeId) => {
    if (!isPrincipal) return;
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await deleteDoc(doc(db, "notices", noticeId));
    } catch (err) {
      setBannerMessage(err.message || "Could not delete notice.");
      return;
    }

    const updated = noticesList.filter((n) => n.id !== noticeId);
    setNoticesList(updated);
    setBannerMessage("Notice deleted successfully.");
    setTimeout(() => setBannerMessage(""), 3000);
  };

  // Split into Latest Notices vs Admission Notices directly
  const latestNotices = useMemo(() => {
    return noticesList.filter((n) => {
      const isAdmission =
        n.type === "admission" ||
        n.category === "Admissions" ||
        n.category === "Admissions 2026-27";
      return !isAdmission;
    });
  }, [noticesList]);

  const admissionNotices = useMemo(() => {
    return noticesList.filter((n) => {
      const isAdmission =
        n.type === "admission" ||
        n.category === "Admissions" ||
        n.category === "Admissions 2026-27";
      return isAdmission;
    });
  }, [noticesList]);

  // Sidebar buttons
  const sidebarButtons = [
    {
      id: "profile",
      label: "Manage Profile",
      icon: User,
    },
    {
      id: "enquiries",
      label: "Student Enquiries",
      icon: MessageSquare,
      count: unreadEnquiryCount > 0 ? unreadEnquiryCount : undefined,
    },
    ...(canManageNotices
      ? [
          {
            id: "latest-notice",
            label: "Upload Latest Notice",
            icon: Megaphone,
            count: latestNotices.length,
          },
          {
            id: "admission-notice",
            label: "Upload Admission Notice",
            icon: GraduationCap,
            count: admissionNotices.length,
          },
        ]
      : []),
    ...(canManageGallery
      ? [{ id: "gallery", label: "Gallery", icon: ImageIcon }]
      : []),
    ...(canManageSyllabus
      ? [{ id: "syllabus", label: "Syllabus", icon: BookOpen }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans antialiased text-slate-800">
      {/* Simple Upload & Edit Modal */}
      <AddNoticeModal
        isOpen={isAddModalOpen && canManageNotices}
        onClose={() => {
          setIsAddModalOpen(false);
          setNoticeToEdit(null);
        }}
        onNoticeCreated={handleNoticeCreated}
        onNoticeUpdated={handleNoticeUpdated}
        noticeToEdit={noticeToEdit}
        currentUser={user}
        staffProfile={profileData}
        isPrincipal={isPrincipal}
        defaultType={modalType}
        modalTitle={
          noticeToEdit
            ? "Edit Notice"
            : modalType === "admission"
              ? "Upload Admission Notice"
              : "Upload Latest Notice"
        }
      />

      {/* HAMBURGER SLIDE-OVER DRAWER (FUTURE FEATURES & FULL PORTAL ACCESS) */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[300px] sm:w-[340px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={COLLEGE_LOGO_URL}
              alt="HSCE Logo"
              className="h-9 w-9 object-contain rounded-full border border-slate-200 shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                HSCE Portal
              </span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
                Admin Console
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* User mini profile card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {profileData.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {profileData.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {profileData.phone || profileData.email}
              </div>
            </div>
          </div>

          {/* Core Modules (The 3 active buttons) */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Active Portal Features
            </span>
            <nav className="space-y-1">
              {sidebarButtons.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all text-left ${
                      isActive
                        ? "bg-blue-50 text-[#0066FF] font-bold border-l-4 border-[#0066FF] rounded-l-none"
                        : "text-slate-700 font-medium hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#0066FF]" : "text-slate-400"
                        }
                      />
                      <span>{label}</span>
                    </div>
                    {count !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Upcoming Features (Hamburger type for future expansion) */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Future Modules (Upcoming)
            </span>
            <div className="space-y-1.5 text-xs">
              {[
                {
                  label: "Student Roster & Verification",
                  icon: Users,
                  badge: "Upcoming",
                },
                {
                  label: "Timetable & Academic Calendar",
                  icon: Calendar,
                  badge: "Upcoming",
                },
                {
                  label: "Attendance & Leave Management",
                  icon: ClipboardList,
                  badge: "Upcoming",
                },
                {
                  label: "Lesson Plans & Syllabus Repository",
                  icon: BookOpen,
                  badge: "Upcoming",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 bg-slate-50/70 border border-slate-200/50 text-[11px]">
                  <div className="flex items-center gap-2">
                    <item.icon size={14} className="text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick External Links */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Quick Links
            </span>
            {canManageGallery && (
              <>
                <a
                  href="/manage/gallery"
                  className="mb-2 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium transition-colors">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-purple-600" />
                    <span>Upload &amp; Manage Gallery</span>
                  </div>
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                </a>
                <a
                  href="/manage/syllabus"
                  className="mb-2 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium transition-colors">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#0066FF]" />
                    <span>Upload &amp; Manage Syllabus</span>
                  </div>
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                </a>
              </>
            )}
            {canManageSyllabus && (
              <a
                href="/manage/syllabus"
                className="mb-2 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium transition-colors">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[#0066FF]" />
                  <span>Upload &amp; Manage Syllabus</span>
                </div>
                <span className="text-[10px] text-slate-400">&rarr;</span>
              </a>
            )}
            {(isPrincipal || permissions.notices || permissions.documents) && (
              <>
                <a
                  href={manageContentPath}
                  className="mb-2 w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium transition-colors">
                  <span>Content management</span>
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                </a>
              </>
            )}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium transition-colors">
              <div className="flex items-center gap-2">
                <ExternalLink size={14} className="text-[#0066FF]" />
                <span>Live College Website</span>
              </div>
              <span className="text-[10px] text-slate-400">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px]">Active Admin Session</span>
          </div>
          {logout && (
            <button
              type="button"
              onClick={() => {
                setIsMobileDrawerOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* TOP HEADER (APP BAR) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* HAMBURGER MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/80 transition-colors shrink-0 shadow-2xs"
            aria-label="Open portal navigation drawer"
            title="Open all features">
            <Menu size={19} className="text-slate-700" />
          </button>

          <img
            src={COLLEGE_LOGO_URL}
            alt="HSCE Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full border border-slate-100 shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight truncate">
                <span className="sm:hidden">HSCE Portal</span>
                <span className="hidden sm:inline">
                  Haryana Shakti College of Education
                </span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200 shrink-0">
                Admin
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate hidden xs:block">
              Approved by NCTE &bull; Affiliated to GGSIPU, Delhi
            </p>
          </div>
        </div>

        {/* User Profile Pill on Right */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-colors text-left">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-2xs">
                {profileData.name?.charAt(0) || "U"}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span className="truncate max-w-[130px]">
                  {profileData.name}
                </span>
                <ChevronDown size={13} className="text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">
                {profileData.designation}
              </p>
            </div>
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in text-xs"
              onClick={() => setIsUserMenuOpen(false)}>
              <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-900">
                {profileData.name}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium">
                <User size={13} className="text-[#0066FF]" />
                <span>Manage Profile</span>
              </button>
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium">
                <ExternalLink size={13} className="text-[#0066FF]" />
                <span>Live Website</span>
              </a>
              <div className="border-t border-slate-100 my-1" />
              {logout && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold">
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* BODY: SIDEBAR + MAIN AREA */}
      <div className="flex-1 flex w-full">
        {/* DESKTOP SIDEBAR: ONLY 3 BUTTONS (HIDDEN ON MOBILE) */}
        <aside className="hidden md:flex md:w-60 bg-white border-r border-slate-200 p-4 flex-col justify-between shrink-0 min-h-[calc(100vh-68px)]">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Menu
            </span>

            <nav className="space-y-1.5" aria-label="Portal Navigation">
              {sidebarButtons.map(({ id, label, icon: Icon, count }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left ${
                      isActive
                        ? "bg-blue-50 text-[#0066FF] font-bold border-l-4 border-[#0066FF] rounded-l-none"
                        : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                    }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#0066FF]" : "text-slate-400"
                        }
                      />
                      <span className="truncate">{label}</span>
                    </div>

                    {count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-blue-100 text-[#0066FF]"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Status */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 px-1 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px]">Admin Session</span>
            </div>

            {logout && (
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50">
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 max-w-7xl w-full">
          {bannerMessage && (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 px-4 text-xs font-semibold text-blue-900 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#0066FF]" />
                <span>{bannerMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setBannerMessage("")}
                className="text-blue-500 hover:text-blue-900 font-bold">
                &times;
              </button>
            </div>
          )}

          {/* ===============================================================
              FEATURE 1: MANAGE PROFILE (COMPACT & SIMPLE)
              =============================================================== */}
          {activeTab === "profile" && (
            <div className="max-w-lg">
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Manage Profile
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your name, mobile number, or change your password.
                </p>
              </div>

              {passwordError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 px-4 text-xs font-semibold text-red-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasswordError("")}
                    className="text-red-500 hover:text-red-800 font-bold ml-2">
                    &times;
                  </button>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User size={14} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                        placeholder="Enter full name"
                        className="portal-input !pl-9 !py-2.5 sm:!py-2 text-sm sm:text-xs"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={14} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        required
                        placeholder="Enter mobile number"
                        className="portal-input !pl-9 !py-2.5 sm:!py-2 text-sm sm:text-xs"
                      />
                    </div>
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-800 block mb-0.5">
                      Change Password
                    </span>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Leave blank if you do not want to change your password.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock size={14} />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 characters"
                            className="portal-input !pl-9 !pr-9 !py-2.5 sm:!py-2 text-sm sm:text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                            {showPassword ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock size={14} />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="portal-input !pl-9 !py-2.5 sm:!py-2 text-sm sm:text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs transition active:scale-[0.98]">
                      <Save size={14} />
                      <span>
                        {savingProfile ? "Saving..." : "Save Profile"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===============================================================
              FEATURE: STUDENT ENQUIRIES & CHATBOT LEADS
              =============================================================== */}
          {activeTab === "enquiries" && (
            <EnquiriesPage currentUser={user} role={role} />
          )}

          {activeTab === "gallery" && canManageGallery && (
            <GalleryPage
              currentUser={user}
              role={role}
              permissions={permissions}
            />
          )}

          {activeTab === "syllabus" && canManageSyllabus && (
            <SyllabusPage
              currentUser={user}
              role={role}
              permissions={permissions}
            />
          )}

          {/* ===============================================================
              FEATURE 2: UPLOAD LATEST NOTICE
              IN 1 ROW SHOW 2 (HORIZONTAL NOTICES)
              =============================================================== */}
          {activeTab === "latest-notice" && (
            <div className="space-y-6">
              {/* Header with "+ Upload Latest Notice" button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Latest Notices &amp; Circulars
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official announcements, examination schedules, and college
                    circulars.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalType("latest");
                    setIsAddModalOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs shrink-0 active:scale-[0.98]">
                  <Plus size={16} />
                  <span>Upload Latest Notice</span>
                </button>
              </div>

              {/* HORIZONTAL NOTICES: IN 1 ROW SHOW 2 */}
              {latestNotices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
                  <Megaphone size={28} className="text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">
                    No notices yet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click &quot;Upload Latest Notice&quot; above to publish your
                    first notice.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {latestNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between ${
                        notice.isPublished === false
                          ? "border-amber-200/90 bg-amber-50/20 opacity-90"
                          : "border-slate-200/90 hover:border-[#0066FF]"
                      }`}>
                      <div>
                        {/* Date, Category & Visibility Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                            <span>
                              {notice.createdAt
                                ? new Date(notice.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "Recent"}
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="text-slate-500 truncate max-w-[110px]">
                              {notice.author || profileData.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Category Chip */}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                              Latest
                            </span>

                            {/* Visibility Badge */}
                            {notice.isPublished !== false ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Visible</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span>Hidden</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                          {notice.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                          {notice.description}
                        </p>
                      </div>

                      {/* Footer Actions: PDF Link + Edit + Hide/Show + Delete */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        {notice.pdfUrl ? (
                          <a
                            href={notice.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/80 text-[#0066FF] hover:bg-blue-100 text-xs font-semibold transition border border-blue-200/60">
                            <FileText size={13} />
                            <span>Document</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            No attachment
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          {/* EDIT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditNotice(notice)}
                            disabled={
                              !isPrincipal && notice.authorUid !== user?.uid
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition active:scale-95"
                            title="Edit this notice">
                            <Pencil size={12} className="text-[#0066FF]" />
                            <span>Edit</span>
                          </button>

                          {/* HIDE / SHOW BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(notice.id)}
                            disabled={
                              !isPrincipal && notice.authorUid !== user?.uid
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 border ${
                              notice.isPublished !== false
                                ? "text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200/80"
                                : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/80"
                            }`}
                            title={
                              notice.isPublished !== false
                                ? "Hide from public view"
                                : "Make visible to public"
                            }>
                            {notice.isPublished !== false ? (
                              <>
                                <EyeOff size={12} className="text-amber-600" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye size={12} className="text-emerald-600" />
                                <span>Show</span>
                              </>
                            )}
                          </button>

                          {/* DELETE BUTTON */}
                          {isPrincipal && (
                            <button
                              type="button"
                              onClick={() => handleDeleteNotice(notice.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition active:scale-95"
                              title="Permanently delete notice">
                              <Trash2 size={12} className="text-rose-600" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              FEATURE 3: UPLOAD ADMISSION NOTICE
              IN 1 ROW SHOW 2 (HORIZONTAL NOTICES)
              =============================================================== */}
          {activeTab === "admission-notice" && (
            <div className="space-y-6">
              {/* Header with "+ Upload Admission Notice" button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Admission Notices &amp; Guidelines
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    B.Ed. counselling schedules, merit lists, seat matrix, and
                    admission forms.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalType("admission");
                    setIsAddModalOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs shrink-0 active:scale-[0.98]">
                  <Plus size={16} />
                  <span>Upload Admission Notice</span>
                </button>
              </div>

              {/* HORIZONTAL NOTICES: IN 1 ROW SHOW 2 */}
              {admissionNotices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-2">
                  <GraduationCap size={28} className="text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">
                    No admission notices yet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click &quot;Upload Admission Notice&quot; above to publish
                    an admission circular.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {admissionNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-[#0066FF] transition-all flex flex-col justify-between">
                      <div>
                        {/* Date & Admission Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2 text-[11px] text-slate-400">
                          <span>
                            {notice.createdAt
                              ? new Date(notice.createdAt).toLocaleDateString(
                                  "en-IN",
                                )
                              : "Recent"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                            Admissions
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug">
                          {notice.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                          {notice.description}
                        </p>
                      </div>

                      {/* Footer: PDF Download & Delete */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        {notice.pdfUrl ? (
                          <a
                            href={notice.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066FF] hover:underline">
                            <FileText size={13} />
                            <span>Download PDF Document</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            By: {notice.author || profileData.name}
                          </span>
                        )}

                        {isPrincipal && (
                          <button
                            type="button"
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium p-1 rounded hover:bg-red-50">
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FLOATING ACTION BUTTON (FAB) FOR FAST UPLOAD */}
      {(activeTab === "latest-notice" || activeTab === "admission-notice") && (
        <button
          type="button"
          onClick={() => {
            setModalType(
              activeTab === "admission-notice" ? "admission" : "latest",
            );
            setIsAddModalOpen(true);
          }}
          className="md:hidden fixed bottom-20 right-4 z-40 bg-[#0066FF] hover:bg-[#0052cc] text-white px-4 py-3 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-90 transition-transform"
          aria-label="Upload Notice">
          <Plus size={18} />
          <span className="text-xs font-bold">New Notice</span>
        </button>
      )}

      {/* MOBILE APP BOTTOM TAB NAVIGATION BAR */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 overflow-x-auto bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-start"
        aria-label="Mobile Navigation">
        {sidebarButtons.map(({ id, label, icon: Icon, count }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`min-w-[64px] flex-none flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? "text-[#0066FF] font-bold"
                  : "text-slate-500 font-medium active:scale-95"
              }`}>
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110 text-[#0066FF]" : "text-slate-400"
                  }`}
                />
                {count !== undefined && count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#0066FF] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {count}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[80px] ${
                  isActive ? "font-bold text-[#0066FF]" : "text-slate-500"
                }`}>
                {id === "profile"
                  ? "Profile"
                  : id === "enquiries"
                    ? "Enquiries"
                    : id === "latest-notice"
                      ? "Latest"
                      : id === "admission-notice"
                        ? "Admission"
                        : id === "gallery"
                          ? "Gallery"
                          : "Syllabus"}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER (DESKTOP ONLY TO KEEP MOBILE APP CLEAN) */}
      <footer className="hidden md:block bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} Haryana Shakti College of Education
          &bull; NCTE Approved &bull; Affiliated to GGSIPU, Delhi
        </p>
      </footer>
    </div>
  );
}
