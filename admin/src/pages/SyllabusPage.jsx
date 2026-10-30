import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  X,
  Copy,
  Check,
  Download,
  GraduationCap,
} from "lucide-react";

import {
  subscribeToSyllabus,
  addSyllabusItem,
  updateSyllabusItem,
  toggleSyllabusPublish,
  deleteSyllabusItem,
} from "../services/syllabusService";
import AdobePdfIcon from "../components/common/AdobePdfIcon";
import { uploadToCloudinary } from "../services/cloudinary";

/* =========================================================
   PAGE CONFIGURATION
   Update these values whenever you want to change the page.
========================================================= */

const PAGE_CONFIG = {
  title: "B.Ed. Syllabus & Course Documents",
  subtitle:
    "Manage academic syllabus documents, update their status, and publish PDFs on the college website.",
  publicPageUrl: "/syllabus",
  defaultYear: "2026-27",
  toastDuration: 3500,
};

const STATUS_OPTIONS = [
  { value: "All", label: "All statuses" },
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Drafts" },
];

const INPUT_CLASS =
  "w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#363991] focus:ring-2 focus:ring-[#363991]/10";

const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-slate-700";

const BUTTON_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#363991] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#292c76] disabled:cursor-not-allowed disabled:opacity-60";

const BUTTON_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50";

/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#363991]">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">{label}</p>
        <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-black leading-none text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ published }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 text-xs font-medium ${published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
        }`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"
          }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function IconButton({ title, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white transition ${danger
          ? "text-rose-600 hover:border-rose-200 hover:bg-rose-50"
          : "text-slate-600 hover:bg-slate-100 hover:text-[#363991]"
        }`}>
      {children}
    </button>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function SyllabusPage({ currentUser, role, permissions }) {
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Form data
  const [formYear, setFormYear] = useState(PAGE_CONFIG.defaultYear);
  const [formPublicationDate, setFormPublicationDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Preview and delete dialogs
  const [previewTarget, setPreviewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const toastTimerRef = useRef(null);

  /* -------------------------------------------------------
     REAL-TIME DATA FROM THE EXISTING ADMIN SERVICE
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setLoadError("");

    try {
      const unsubscribe = subscribeToSyllabus(
        (list) => {
          if (!mounted) return;

          setSyllabusList(Array.isArray(list) ? list : []);
          setLoading(false);
          setLoadError("");
        },
        (error) => {
          if (!mounted) return;

          console.error("Syllabus subscription error:", error);
          setLoadError("Unable to load syllabus documents. Please retry.");
          setLoading(false);
        },
      );

      return () => {
        mounted = false;

        if (typeof unsubscribe === "function") {
          unsubscribe();
        }

        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
      };
    } catch (error) {
      console.error("Syllabus loading error:", error);
      setLoadError("Unable to connect to the syllabus service.");
      setLoading(false);

      return () => {
        mounted = false;
      };
    }
  }, [retryCount]);

  /* -------------------------------------------------------
     TOAST
  ------------------------------------------------------- */

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage({ message, type });

    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, PAGE_CONFIG.toastDuration);
  };

  /* -------------------------------------------------------
     RESET FORM
  ------------------------------------------------------- */

  const resetForm = () => {
    setEditingItem(null);
    setFormYear(PAGE_CONFIG.defaultYear);
    setFormPublicationDate(new Date().toISOString().slice(0, 10));
    setFormPdfUrl("");
    setFormIsPublished(true);
    setUploadError("");
  };

  const closeUploadModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    resetForm();
  };

  const openNewSyllabus = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditSyllabus = (item) => {
    setEditingItem(item);
    setFormYear(item.year || "");
    setFormPublicationDate(item.publicationDate || "");
    setFormPdfUrl(item.pdfUrl || "");
    setFormIsPublished(!!item.isPublished);
    setUploadError("");
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        setIsModalOpen(false);
        setEditingItem(null);
        setUploadError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, isSubmitting]);

  /* -------------------------------------------------------
     SAVE SYLLABUS
  ------------------------------------------------------- */

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setUploadError("");

    const year = formYear.trim();

    if (!year) {
      setUploadError("Please enter the academic year.");
      return;
    }

    if (!formPublicationDate) {
      setUploadError("Please choose the publication date.");
      return;
    }

    const pdfUrl = formPdfUrl.trim();
    if (!pdfUrl) {
      setUploadError("Please enter a direct PDF URL.");
      return;
    }

    try {
      const parsedUrl = new URL(pdfUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setUploadError("Please enter a valid HTTPS or HTTP PDF URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const syllabusData = {
        year,
        session: year,
        publicationDate: formPublicationDate,
        pdfUrl,
        isPublished: formIsPublished,
      };
      const result = editingItem
        ? await updateSyllabusItem(editingItem.id, syllabusData)
        : await addSyllabusItem(syllabusData, currentUser);

      if (result?.success) {
        showToast(
          editingItem
            ? "Syllabus updated."
            : formIsPublished
              ? "Syllabus saved and published."
              : "Syllabus saved as a draft.",
        );

        resetForm();
        setIsModalOpen(false);
      } else {
        setUploadError(result?.error || "Unable to save the syllabus.");
      }
    } catch (error) {
      console.error("Save syllabus error:", error);
      setUploadError(
        error?.message || "An error occurred while saving the syllabus.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------------------------------------------
     PUBLISH / UNPUBLISH
  ------------------------------------------------------- */

  const handleTogglePublish = async (item) => {
    if (!item?.id) return;

    setBusyItemId(item.id);

    try {
      await toggleSyllabusPublish(item.id, !item.isPublished);

      showToast(
        item.isPublished
          ? "Syllabus moved to drafts."
          : "Syllabus published successfully.",
      );
    } catch (error) {
      console.error("Update syllabus status error:", error);
      showToast("Unable to update publication status.", "error");
    } finally {
      setBusyItemId(null);
    }
  };

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;

    setIsDeleting(true);

    try {
      await deleteSyllabusItem(deleteTarget.id);

      showToast("Syllabus document deleted.");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete syllabus error:", error);
      showToast("Unable to delete the syllabus.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  /* -------------------------------------------------------
     COPY PDF LINK
  ------------------------------------------------------- */

  const handleCopyLink = async (url, id) => {
    if (!url) {
      showToast("No document link is available.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast("Document link copied.");

      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1800);
    } catch (error) {
      console.error("Copy link error:", error);
      showToast("Unable to copy the link.", "error");
    }
  };

  /* -------------------------------------------------------
     FILTERED DATA
  ------------------------------------------------------- */

  const filteredSyllabi = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return syllabusList.filter((item) => {
      const searchableText = [item.title, item.year, item.publicationDate]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesYear = yearFilter === "All" || item.year === yearFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && item.isPublished) ||
        (statusFilter === "Draft" && !item.isPublished);

      return matchesSearch && matchesYear && matchesStatus;
    });
  }, [syllabusList, searchTerm, yearFilter, statusFilter]);

  const availableYears = useMemo(() => {
    const years = new Set([
      PAGE_CONFIG.defaultYear,
      ...syllabusList.map((item) => item.year).filter(Boolean),
    ]);

    return [...years].sort((a, b) => b.localeCompare(a));
  }, [syllabusList]);

  const stats = useMemo(() => {
    const total = syllabusList.length;
    const published = syllabusList.filter((item) => item.isPublished).length;

    return {
      total,
      published,
      drafts: total - published,
      years: new Set(syllabusList.map((item) => item.year).filter(Boolean))
        .size,
    };
  }, [syllabusList]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || yearFilter !== "All" || statusFilter !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setYearFilter("All");
    setStatusFilter("All");
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="min-w-0 space-y-5 text-slate-800 sm:space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-3 top-3 z-[100] flex max-w-[calc(100vw-24px)] items-start gap-2 border px-4 py-3 text-sm shadow-lg sm:right-5 sm:top-5 ${toastMessage.type === "error"
              ? "border-rose-200 bg-white text-rose-700"
              : "border-emerald-200 bg-white text-emerald-700"
            }`}>
          {toastMessage.type === "error" ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          )}

          <span className="break-words">{toastMessage.message}</span>

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToastMessage(null)}
            className="ml-2 shrink-0 text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page heading */}
      <section className="border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#363991]">
              <GraduationCap size={17} />
              <span>Academic Administration</span>
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {PAGE_CONFIG.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {PAGE_CONFIG.subtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <a
              href={PAGE_CONFIG.publicPageUrl}
              target="_blank"
              rel="noreferrer"
              className={BUTTON_SECONDARY}>
              <ExternalLink size={16} />
              Public page
            </a>

            <button
              type="button"
              onClick={openNewSyllabus}
              className={BUTTON_PRIMARY}>
              <Plus size={17} />
              Add syllabus
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            label="Total documents"
            value={stats.total}
            icon={FileText}
          />
          <StatCard label="Published" value={stats.published} icon={Eye} />
          <StatCard label="Drafts" value={stats.drafts} icon={EyeOff} />
          <StatCard
            label="Academic years"
            value={stats.years}
            icon={Calendar}
          />
        </div>
      </section>

      {/* Search and filters */}
      <section className="border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1fr)_190px_170px_auto]">
          <div className="relative min-w-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search academic year or date..."
              aria-label="Search syllabus documents"
              className={`${INPUT_CLASS} pl-9`}
            />
          </div>

          <select
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
            aria-label="Filter by academic year"
            className={INPUT_CLASS}>
            <option value="All">All academic years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by publication status"
            className={INPUT_CLASS}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`${BUTTON_SECONDARY} disabled:cursor-not-allowed disabled:opacity-40`}>
            <Filter size={16} />
            Clear filters
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredSyllabi.length}
          </span>{" "}
          of {syllabusList.length} documents
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section className="border border-slate-200 bg-white px-4 py-14 text-center">
          <RefreshCw
            size={27}
            className="mx-auto mb-3 animate-spin text-[#363991]"
          />
          <p className="text-sm font-medium text-slate-700">
            Loading syllabus documents...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Connecting to the syllabus service
          </p>
        </section>
      )}

      {/* Load error */}
      {!loading && loadError && (
        <section className="border border-rose-200 bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={21} />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-slate-900">
                Unable to load documents
              </h2>
              <p className="mt-1 text-sm text-slate-600">{loadError}</p>

              <button
                type="button"
                onClick={() => setRetryCount((c) => c + 1)}
                className={`${BUTTON_SECONDARY} mt-4`}>
                <RefreshCw size={15} />
                Retry
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && !loadError && filteredSyllabi.length === 0 && (
        <section className="border border-slate-200 bg-white px-4 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-slate-100 text-[#363991]">
            <FileText size={24} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-slate-900">
            {hasActiveFilters
              ? "No matching documents"
              : "No syllabus documents yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {hasActiveFilters
              ? "Try changing the search term or clearing the filters."
              : "Add a syllabus PDF or a hosted PDF link to start building the catalogue."}
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className={`${BUTTON_SECONDARY} mt-4`}>
              Clear filters
            </button>
          ) : (
            <button
              type="button"
              onClick={openNewSyllabus}
              className={`${BUTTON_PRIMARY} mt-4`}>
              <Plus size={16} />
              Add syllabus
            </button>
          )}
        </section>
      )}

      {/* Desktop table */}
      {!loading && !loadError && filteredSyllabi.length > 0 && (
        <>
          <section className="hidden overflow-hidden border border-slate-200 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Academic year</th>
                    <th className="px-4 py-4">Publication date</th>
                    <th className="px-4 py-4">Document</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSyllabi.map((item) => (
                    <tr
                      key={item.id}
                      className="align-top transition hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                          <Calendar size={14} className="text-slate-400" />
                          {item.year || "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {item.publicationDate || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setPreviewTarget(item)}
                          disabled={!item.pdfUrl}
                          className="inline-flex items-center gap-1.5 font-medium text-[#363991] hover:underline disabled:text-slate-400 disabled:no-underline">
                          <AdobePdfIcon size={16} />
                          Preview PDF
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge published={!!item.isPublished} />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1.5">
                          <IconButton
                            title="Preview PDF"
                            onClick={() => setPreviewTarget(item)}>
                            <Eye size={16} />
                          </IconButton>

                          <IconButton
                            title="Edit syllabus"
                            onClick={() => openEditSyllabus(item)}>
                            <Pencil size={16} />
                          </IconButton>

                          <IconButton
                            title={
                              item.isPublished
                                ? "Move to drafts"
                                : "Publish document"
                            }
                            onClick={() => handleTogglePublish(item)}>
                            {busyItemId === item.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : item.isPublished ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </IconButton>

                          <IconButton
                            title="Copy document link"
                            onClick={() =>
                              handleCopyLink(item.pdfUrl, item.id)
                            }>
                            {copiedId === item.id ? (
                              <Check size={16} className="text-emerald-600" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </IconButton>

                          <IconButton
                            title="Delete document"
                            danger
                            onClick={() => setDeleteTarget(item)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile and tablet cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {filteredSyllabi.map((item) => (
              <article
                key={item.id}
                className="min-w-0 border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-[#363991]">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {item.year || "No year"}
                      </span>
                      <StatusBadge published={!!item.isPublished} />
                    </div>

                    <h3 className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <p>
                    <span className="font-medium text-slate-700">
                      Publication date:
                    </span>{" "}
                    {item.publicationDate || "—"}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openEditSyllabus(item)}
                    className={`${BUTTON_SECONDARY} min-w-0 px-2 text-xs`}>
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTarget(item)}
                    disabled={!item.pdfUrl}
                    className={`${BUTTON_SECONDARY} min-w-0 px-2 text-xs`}>
                    <Eye size={15} />
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    disabled={busyItemId === item.id}
                    className={`${BUTTON_SECONDARY} min-w-0 px-2 text-xs`}>
                    {busyItemId === item.id ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : item.isPublished ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}

                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(item.pdfUrl, item.id)}
                    className={`${BUTTON_SECONDARY} min-w-0 px-2 text-xs`}>
                    {copiedId === item.id ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}
                    Copy link
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-rose-200 bg-white px-2 py-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50">
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {/* =====================================================
          ADD SYLLABUS MODAL
      ===================================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-950/50 sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeUploadModal();
            }
          }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="syllabus-modal-title"
            className="flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none sm:rounded-2xl bg-white shadow-none sm:shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-2xl border-0 sm:border sm:border-slate-200">
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 sm:px-6 bg-white sm:bg-slate-50/50 shrink-0">
              <div className="flex min-w-0 items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100">
                  {editingItem ? <Pencil size={19} /> : <Upload size={19} />}
                </div>

                <div className="min-w-0">
                  <h2
                    id="syllabus-modal-title"
                    className="text-base font-bold text-slate-900 leading-tight">
                    {editingItem
                      ? "Edit syllabus document"
                      : "Add syllabus document"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Add the PDF link and academic details below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                disabled={isSubmitting}
                aria-label="Close syllabus form"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
                <X size={19} />
              </button>
            </header>

            <form
              onSubmit={handleFormSubmit}
              className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 -webkit-overflow-scrolling-touch">
              {uploadError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <span className="break-words">{uploadError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="syllabus-pdf-url"
                  className={`${LABEL_CLASS} flex items-center gap-1.5`}>
                  <AdobePdfIcon size={18} />
                  <span>
                    PDF Document URL <span className="text-rose-600">*</span>
                  </span>
                </label>
                <div>
                  <input
                    id="syllabus-pdf-url"
                    type="url"
                    required
                    value={formPdfUrl}
                    onChange={(event) => setFormPdfUrl(event.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view or https://example.com/syllabus.pdf"
                    className={INPUT_CLASS}
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                    💡 <strong>Tip:</strong> Paste your Google Drive sharing link or direct PDF document link. (Ensure Google Drive sharing is set to <em>&ldquo;Anyone with the link can view&rdquo;</em>).
                  </p>
                </div>
                {formPdfUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={formPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:underline">
                      <AdobePdfIcon size={14} />
                      <span>Preview Selected PDF Document</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Academic year and publication date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="syllabus-year" className={LABEL_CLASS}>
                    Academic year <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="syllabus-year"
                    type="text"
                    required
                    maxLength={40}
                    value={formYear}
                    onChange={(event) => setFormYear(event.target.value)}
                    placeholder="2026-27"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="syllabus-publication-date"
                    className={LABEL_CLASS}>
                    Publication date <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="syllabus-publication-date"
                    type="date"
                    required
                    value={formPublicationDate}
                    onChange={(event) =>
                      setFormPublicationDate(event.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Publish setting */}
              <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">
                <input
                  id="syllabus-publish"
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(event) => setFormIsPublished(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#363991]"
                />

                <label
                  htmlFor="syllabus-publish"
                  className="min-w-0 cursor-pointer">
                  <span className="block text-sm font-medium text-slate-800">
                    Publish on public website
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Turn this off to save the document as a draft. Your public
                    page must filter out drafts.
                  </span>
                </label>
              </div>

              <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:px-6 sm:py-4 bg-white sm:bg-slate-50/50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end shrink-0">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={closeUploadModal}
                  className={BUTTON_SECONDARY}>
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={BUTTON_PRIMARY}>
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingItem ? <Pencil size={16} /> : <Upload size={16} />}
                      {editingItem ? "Save changes" : "Save syllabus"}
                    </>
                  )}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {/* =====================================================
          PDF PREVIEW MODAL - FULLSCREEN ON MOBILE
      ===================================================== */}

      {previewTarget && (
        <div
          className="fixed inset-0 z-[90] flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-950/70 sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewTarget(null);
            }
          }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            className="flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none sm:rounded-2xl bg-white sm:h-[85vh] sm:max-w-5xl border-0 sm:border border-slate-200">
            <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-3 sm:px-5 bg-white sm:bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setPreviewTarget(null)}
                  className="sm:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    {previewTarget.year || "Academic syllabus"}
                    {previewTarget.publicationDate
                      ? ` · Published ${previewTarget.publicationDate}`
                      : ""}
                  </p>

                  <h2
                    id="preview-title"
                    className="mt-0.5 truncate text-sm font-semibold text-slate-900 sm:text-base">
                    {previewTarget.title}
                  </h2>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {previewTarget.pdfUrl && (
                  <a
                    href={previewTarget.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:px-3">
                    <Download size={15} />
                    <span className="hidden sm:inline">Open / Download</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setPreviewTarget(null)}
                  aria-label="Close PDF preview"
                  className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                  <X size={19} />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 bg-slate-100">
              {previewTarget.pdfUrl ? (
                <iframe
                  src={
                    previewTarget.pdfUrl.includes("drive.google.com")
                      ? previewTarget.pdfUrl.replace(/\/view(\?.*)?$/, "/preview")
                      : `${previewTarget.pdfUrl}#toolbar=1`
                  }
                  title={previewTarget.title || "Syllabus PDF preview"}
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
                  No document URL is available.
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center bg-rose-50 text-rose-600">
              <Trash2 size={21} />
            </div>

            <h2
              id="delete-title"
              className="mt-4 text-lg font-semibold text-slate-900">
              Delete syllabus document?
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900">{deleteTarget.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className={BUTTON_SECONDARY}>
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
                {isDeleting ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete document
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
