import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import AdobePdfIcon from "../common/AdobePdfIcon";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Save,
  AlertCircle,
  FileCheck,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  collection,
  limit,
  onSnapshot,
  doc,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, firebaseReady } from "../../config/firebase";

const CATEGORIES = ["All", "Admissions", "Academic", "Disclosure", "General"];

export default function DashboardNoticesManager({
  role = "staff",
  currentUser,
}) {
  const isPrincipal = role === "principal";

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Published, Draft

  // Modal states
  const [detailsNotice, setDetailsNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states for Add/Edit
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formDescription, setFormDescription] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formSaving, setFormSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Firestore subscription
  useEffect(() => {
    if (!firebaseReady) return;
    setLoading(true);

    const unsubscribe = onSnapshot(
      query(
        collection(db, "notices"),
        orderBy("createdAt", "desc"),
        limit(100),
      ),
      (snapshot) => {
        const remoteRecords = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let pubDate = "";
          if (
            data.publishedAt &&
            typeof data.publishedAt.toDate === "function"
          ) {
            pubDate = data.publishedAt.toDate().toISOString().split("T")[0];
          } else if (data.publishedAt) {
            pubDate = String(data.publishedAt);
          } else {
            pubDate = new Date().toISOString().split("T")[0];
          }

          return {
            id: docSnap.id,
            ...data,
            publishedAt: pubDate,
          };
        });
        setNotices(remoteRecords);
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore notices fetch error:", err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Open Edit Modal
  const handleOpenEdit = (notice) => {
    setEditingNotice(notice);
    setFormTitle(notice.title || "");
    setFormCategory(notice.category || "General");
    setFormDescription(notice.description || "");
    setFormPdfUrl(notice.pdfUrl || "");
    setFormIsPublished(notice.isPublished === true);
    setDetailsNotice(null);
    setErrorMessage("");
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setEditingNotice(null);
    setFormTitle("");
    setFormCategory("General");
    setFormDescription("");
    setFormPdfUrl("");
    setFormIsPublished(true);
    setErrorMessage("");
  };

  // Close modals
  const handleCloseModal = () => {
    setDetailsNotice(null);
    setEditingNotice(null);
    setIsAddingNew(false);
    setErrorMessage("");
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrorMessage("Please enter a notice title.");
      return;
    }
    setFormSaving(true);
    setErrorMessage("");

    try {
      const updatedData = {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        pdfUrl: formPdfUrl.trim(),
        isPublished: formIsPublished,
        updatedAt: serverTimestamp(),
      };

      if (!firebaseReady || !currentUser?.uid) {
        throw new Error("Sign in with an authorized account to edit notices.");
      }
      const existingPublishedAt =
        typeof editingNotice.publishedAt?.toDate === "function"
          ? editingNotice.publishedAt
          : null;
      Object.assign(updatedData, {
        slug:
          editingNotice.slug ||
          `${formTitle
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")}-${editingNotice.id}`,
        publicationDate:
          editingNotice.publicationDate ||
          new Date().toISOString().slice(0, 10),
        referenceNumber: editingNotice.referenceNumber || "",
        department: editingNotice.department || "",
        importantDate: editingNotice.importantDate || "",
        officialUrl: editingNotice.officialUrl || "",
        isPinned: editingNotice.isPinned === true,
        status: formIsPublished ? "published" : "draft",
        publishedAt: formIsPublished ? serverTimestamp() : existingPublishedAt,
        createdAt:
          typeof editingNotice.createdAt?.toDate === "function"
            ? editingNotice.createdAt
            : serverTimestamp(),
        authorUid: editingNotice.authorUid || currentUser.uid,
        authorName:
          editingNotice.authorName ||
          currentUser.displayName ||
          currentUser.email,
      });
      await updateDoc(doc(db, "notices", editingNotice.id), updatedData);

      // Update local state
      setNotices((prev) =>
        prev.map((item) =>
          item.id === editingNotice.id
            ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
            : item,
        ),
      );

      showToast("Notice updated and saved successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Save notice error:", err);
      setErrorMessage("Could not save to database: " + err.message);
    } finally {
      setFormSaving(false);
    }
  };

  // Save New Notice
  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrorMessage("Please enter a notice title.");
      return;
    }
    setFormSaving(true);
    setErrorMessage("");

    try {
      if (!firebaseReady || !currentUser?.uid) {
        throw new Error(
          "Sign in with an authorized account to publish notices.",
        );
      }
      const noticeRef = doc(collection(db, "notices"));
      const publicationTimestamp = serverTimestamp();
      const newRecord = {
        id: noticeRef.id,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        pdfUrl: formPdfUrl.trim(),
        slug: `${formTitle
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${noticeRef.id}`,
        publicationDate: new Date().toISOString().slice(0, 10),
        referenceNumber: "",
        department: "",
        importantDate: "",
        officialUrl: "",
        isPinned: false,
        isPublished: formIsPublished,
        status: formIsPublished ? "published" : "draft",
        publishedAt: formIsPublished ? publicationTimestamp : null,
        createdAt: publicationTimestamp,
        updatedAt: serverTimestamp(),
        authorUid: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
      };

      const { id, ...recordData } = newRecord;
      await setDoc(noticeRef, recordData);

      setNotices((prev) => [newRecord, ...prev]);
      showToast("New notice published successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Create notice error:", err);
      setErrorMessage("Could not create notice: " + err.message);
    } finally {
      setFormSaving(false);
    }
  };

  // Quick toggle publication status
  const handleTogglePublished = async (notice) => {
    if (!isPrincipal && notice.authorUid !== currentUser?.uid) return;
    const nextStatus = !notice.isPublished;
    try {
      await updateDoc(doc(db, "notices", notice.id), {
        isPublished: nextStatus,
        status: nextStatus ? "published" : "draft",
        publishedAt: nextStatus
          ? serverTimestamp()
          : typeof notice.publishedAt?.toDate === "function"
            ? notice.publishedAt
            : null,
        updatedAt: serverTimestamp(),
      });
      setNotices((prev) =>
        prev.map((item) =>
          item.id === notice.id ? { ...item, isPublished: nextStatus } : item,
        ),
      );
      showToast(
        nextStatus
          ? "Notice published to live website."
          : "Notice moved to Draft (hidden from website).",
      );
    } catch (err) {
      console.error("Toggle publish error:", err);
      showToast("Could not change publication status: " + err.message);
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (notice) => {
    if (!isPrincipal) return;
    if (
      !window.confirm(
        `Are you sure you want to delete notice "${notice.title}"?`,
      )
    ) {
      return;
    }
    try {
      await deleteDoc(doc(db, "notices", notice.id));
      setNotices((prev) => prev.filter((item) => item.id !== notice.id));
      showToast("Notice deleted successfully.");
      if (detailsNotice?.id === notice.id) {
        setDetailsNotice(null);
      }
    } catch (err) {
      console.error("Delete notice error:", err);
      showToast("Could not delete notice: " + err.message);
    }
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchSearch =
        searchQuery === "" ||
        notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "All" ||
        notice.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && notice.isPublished === true) ||
        (statusFilter === "Draft" && !notice.isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [notices, searchQuery, selectedCategory, statusFilter]);

  const stats = useMemo(() => {
    const total = notices.length;
    const published = notices.filter((n) => n.isPublished).length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [notices]);

  return (
    <div className="space-y-4">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm text-emerald-800 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="text-emerald-600 hover:text-emerald-900">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                <Megaphone size={12} />
                Website Circulars & Announcements
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ({stats.total} total &bull; {stats.published} published)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {isPrincipal
                ? "Official Website Notices Board"
                : "Notices & Circulars Desk"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review published announcements, check full notice contents, or
              edit details directly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs shadow-sm transition-all focus:outline-none">
              <Plus size={15} />
              <span>Post New Notice</span>
            </button>
            <Link
              to="/notices"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Layers size={14} className="text-slate-500" />
              <span>All Records</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search notices by title, keyword, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter Pills & Status Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none">
              <option value="All">All Status</option>
              <option value="Published">Published Only</option>
              <option value="Draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notices List Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            Loading website notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Megaphone size={28} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">
              No notices found
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setStatusFilter("All");
              }}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline">
              Reset all filters
            </button>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const categoryColor =
              notice.category === "Admissions"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : notice.category === "Academic"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : notice.category === "Disclosure"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";

            return (
              <div
                key={notice.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-blue-400/80 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${categoryColor}`}>
                        {notice.category || "General"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          notice.isPublished
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                        {notice.isPublished ? (
                          <>
                            <CheckCircle2 size={11} />
                            <span>Live on Website</span>
                          </>
                        ) : (
                          <>
                            <Clock size={11} />
                            <span>Draft (Internal)</span>
                          </>
                        )}
                      </span>

                      {notice.publishedAt && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar size={12} />
                          <span>{notice.publishedAt}</span>
                        </span>
                      )}

                      {notice.pdfUrl && notice.pdfUrl !== "#" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          <FileText size={10} />
                          <span>PDF Attached</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {notice.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center sm:self-start gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    {/* Check Details button */}
                    <button
                      type="button"
                      onClick={() => setDetailsNotice(notice)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 transition-colors"
                      title="Check Details">
                      <Eye size={13} />
                      <span>Check Details</span>
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(notice)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Edit Notice">
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    {/* Quick Publish Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(notice)}
                      className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${
                        notice.isPublished
                          ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                      title={
                        notice.isPublished
                          ? "Unpublish notice"
                          : "Publish notice"
                      }>
                      {notice.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(notice)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Notice">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: CHECK DETAILS MODAL */}
      {detailsNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <FileText size={16} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notice Inspection &amp; Details
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  {detailsNotice.category || "General"}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${
                    detailsNotice.isPublished
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                  {detailsNotice.isPublished
                    ? "Live on Website"
                    : "Draft (Internal Only)"}
                </span>
                {detailsNotice.publishedAt && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={13} />
                    <span>Published Date: {detailsNotice.publishedAt}</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {detailsNotice.title}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Notice Statement
                </h4>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {detailsNotice.description}
                </p>
              </div>

              {/* PDF Document Attachment Section */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Attached Regulatory Document / PDF
                </h4>
                {detailsNotice.pdfUrl && detailsNotice.pdfUrl !== "#" ? (
                  <div className="flex items-center justify-between gap-3 bg-rose-50/70 border border-rose-200/80 rounded-lg p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AdobePdfIcon size={22} className="shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          Official PDF Circular Document
                        </p>
                        <p className="text-[11px] text-slate-500 truncate font-mono">
                          {detailsNotice.pdfUrl}
                        </p>
                      </div>
                    </div>
                    <a
                      href={detailsNotice.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 shadow-2xs transition-all">
                      <span>Open PDF</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No PDF document linked with this circular.
                  </p>
                )}
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Record ID: {detailsNotice.id}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/70">
              <button
                type="button"
                onClick={() => handleOpenEdit(detailsNotice)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-2xs">
                <Edit3 size={14} />
                <span>Edit This Notice</span>
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT OR ADD NOTICE MODAL */}
      {(editingNotice || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {editingNotice ? <Edit3 size={15} /> : <Plus size={16} />}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {editingNotice
                    ? "Edit Website Notice"
                    : "Post New Website Notice"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={editingNotice ? handleSaveEdit : handleSaveNew}
              className="p-6 overflow-y-auto space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admission Notice 2025-26"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="General">General</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Academic">Academic</option>
                  <option value="Disclosure">Disclosure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Circular Text *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Provide complete instructions, eligibility, and information for students and public..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <AdobePdfIcon size={16} />
                    <span>Attached PDF Link (Google Drive or Web URL)</span>
                  </label>
                  {formPdfUrl.trim() && (
                    <a
                      href={formPdfUrl.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:underline">
                      Preview Link ↗
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../view or https://..."
                  value={formPdfUrl}
                  onChange={(e) => setFormPdfUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  💡 Paste your Google Drive sharing link or direct PDF document link. (Ensure sharing is set to &ldquo;Anyone with the link can view&rdquo;).
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Publish immediately on public website
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 ml-6">
                  If unchecked, notice will be saved as an internal Draft.
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60">
                  <Save size={14} />
                  <span>
                    {formSaving
                      ? "Saving..."
                      : editingNotice
                        ? "Save Changes"
                        : "Publish Notice"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
