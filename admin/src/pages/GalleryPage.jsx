import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  X,
  FileImage,
  ChevronLeft,
  Sparkles,
  LayoutGrid,
  List,
  Copy,
  Check,
  Pencil,
  Tag,
  Settings,
} from "lucide-react";
import {
  uploadToCloudinary,
  compressImageFile,
  getCloudinaryConfig,
  setCloudinaryConfig,
  optimizeCloudinaryImageUrl,
} from "../services/cloudinary";
import {
  subscribeToGallery,
  addGalleryImage,
  updateGalleryImage,
  toggleGalleryPublish,
  deleteGalleryImage,
} from "../services/galleryService";

const PRESET_CATEGORIES = [
  "Campus Life",
  "Learning Spaces",
  "Student Activities",
  "Student Voices",
  "Academic Seminar",
];

export default function GalleryPage({ currentUser, role, permissions }) {
  // Gallery images from service
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & display
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // 'file' | 'url'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Campus Life");
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [editingImageId, setEditingImageId] = useState(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Lightbox in admin
  const [lightboxItem, setLightboxItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fileInputRef = useRef(null);

  // Subscribe to gallery updates
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToGallery((data) => {
      setImages(data || []);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Show auto-dismissing toast
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Reset form
  const resetForm = () => {
    setFormTitle("");
    setFormCategory("Campus Life");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormImageUrl("");
    setFormImageFile(null);
    setFormImagePreview("");
    setFormIsPublished(true);
    setEditingImageId(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (image) => {
    setEditingImageId(image.id);
    setFormTitle(image.title || "");
    setFormCategory(
      PRESET_CATEGORIES.includes(image.category)
        ? image.category
        : "Campus Life",
    );
    setFormDate(image.date || new Date().toISOString().slice(0, 10));
    setFormImageUrl(image.image || "");
    setFormImageFile(null);
    setFormImagePreview(image.image || "");
    setFormIsPublished(image.isPublished !== false);
    setUploadMode("url");
    setUploadError("");
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (isSubmitting) return;
    setIsUploadModalOpen(false);
    resetForm();
  };

  useEffect(() => {
    if (!isUploadModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        setIsUploadModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUploadModalOpen, isSubmitting]);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, GIF).");
      return;
    }

    // Recommended limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(
        "Image size exceeds 5MB. Please choose a smaller image or compressed file.",
      );
      return;
    }

    setUploadError("");
    setFormImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFormImagePreview(reader.result);
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Handle URL change
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormImageUrl(url);
    setFormImagePreview(url.trim());
    setUploadError("");
  };

  // Handle Form Submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    const title = formTitle.trim();
    if (!title) {
      setUploadError("Please enter a descriptive photo title.");
      return;
    }

    const effectiveCategory = formCategory;

    let finalImageUrl =
      uploadMode === "url" ? formImageUrl.trim() : formImagePreview.trim();
    if (!finalImageUrl) {
      setUploadError(
        "Please choose an image file or provide a valid image URL.",
      );
      return;
    }

    if (uploadMode === "url") {
      try {
        const parsedUrl = new URL(finalImageUrl);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setUploadError("Please enter a valid HTTPS or HTTP image URL.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (formImageFile) {
        try {
          const upload = await uploadToCloudinary(formImageFile, {
            folder: "hsce_gallery",
          });
          finalImageUrl = upload.secure_url;
        } catch (uploadErr) {
          console.warn(
            "Cloudinary upload failed, falling back to client-side compression:",
            uploadErr,
          );
          finalImageUrl = await compressImageFile(formImageFile, 1400, 0.82);
        }
      }

      if (!finalImageUrl && formImagePreview) {
        finalImageUrl = formImagePreview;
      }

      const photoData = {
        title,
        category: effectiveCategory,
        date: formDate,
        image: finalImageUrl,
        isPublished: formIsPublished,
      };
      const result = editingImageId
        ? await updateGalleryImage(editingImageId, photoData)
        : await addGalleryImage(photoData, currentUser);

      if (result.success) {
        showToast(
          editingImageId ? "Photo updated." : "Photo added to gallery.",
        );
        resetForm();
        setIsUploadModalOpen(false);
      } else {
        setUploadError(
          result.error || "Failed to save photo. Please try again.",
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Final resilient fallback: if formImagePreview is ready, persist directly
      if (formImagePreview) {
        try {
          const photoData = {
            title,
            category: effectiveCategory,
            date: formDate,
            image: formImagePreview,
            isPublished: formIsPublished,
          };
          const result = editingImageId
            ? await updateGalleryImage(editingImageId, photoData)
            : await addGalleryImage(photoData, currentUser);
          if (result.success) {
            showToast(
              editingImageId ? "Photo updated." : "Photo added to gallery.",
            );
            resetForm();
            setIsUploadModalOpen(false);
            return;
          }
        } catch (fallbackErr) {
          console.error("Direct save fallback error:", fallbackErr);
        }
      }
      setUploadError(
        err?.message || "Failed to save photo. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle publish
  const handleTogglePublish = async (id, currentPublished) => {
    try {
      await toggleGalleryPublish(id, !currentPublished);
      showToast(
        !currentPublished
          ? "Photo is now Published and visible on public website."
          : "Photo is now moved to Draft (hidden from public).",
      );
    } catch (err) {
      console.error("Error toggling publish:", err);
      showToast("Failed to update status", "error");
    }
  };

  // Delete photo
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteGalleryImage(deleteTarget.id);
      showToast("Photo deleted permanently.");
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete photo", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy link
  const handleCopyLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Category options list
  const availableCategories = useMemo(() => {
    const set = new Set(PRESET_CATEGORIES);
    images.forEach((img) => {
      if (img.category) set.add(img.category);
    });
    return ["All", ...Array.from(set)];
  }, [images]);

  // Filtered Images
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        (img.title && img.title.toLowerCase().includes(search)) ||
        (img.category && img.category.toLowerCase().includes(search)) ||
        (img.date && img.date.includes(search));

      // Category
      const matchCategory =
        categoryFilter === "All" || img.category === categoryFilter;

      // Status
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && img.isPublished) ||
        (statusFilter === "Draft" && !img.isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [images, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = images.length;
    const published = images.filter((img) => img.isPublished).length;
    const drafts = total - published;
    const categoriesCount = new Set(images.map((img) => img.category)).size;
    return { total, published, drafts, categoriesCount };
  }, [images]);

  return (
    <div className="academic-admin-page space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-semibold transition-all duration-300 animate-slideIn ${toastMessage.type === "error"
              ? "bg-rose-600 text-white"
              : "bg-emerald-600 text-white"
            }`}>
          {toastMessage.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066FF]">
              <Sparkles size={14} />
              <span>Campus Media & Gallery Operations</span>
            </div>
            <h1 className="text-2xl font-bold font-poppins text-slate-900 mt-1">
              Campus Photo Gallery Manager
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Admin console for uploading, categorizing, and publishing
              high-resolution campus photographs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="https://www.hscekanjhawala.com/gallery"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              <ExternalLink size={14} />
              <span>View Public Gallery</span>
            </a>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
              <Plus size={16} />
              <span>Upload New Photo</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-100">
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Uploads
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">
              {stats.total}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published (Live)
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">
              {stats.published}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Drafts / Hidden
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">
              {stats.drafts}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Categories
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 sm:mt-1">
              {stats.categoriesCount}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, category, or date..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters & View Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Tag size={13} className="text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-slate-700 focus:outline-none cursor-pointer">
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter size={13} className="text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-medium text-slate-700 focus:outline-none cursor-pointer">
                <option value="All">All Statuses</option>
                <option value="Published">Published Only</option>
                <option value="Draft">Drafts Only</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
                title="Grid View">
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-medium transition ${viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
                title="Table View">
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Items Grid or Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw
            className="animate-spin mx-auto text-[#0066FF] mb-3"
            size={28}
          />
          <p className="text-sm font-semibold text-slate-700">
            Loading gallery photos...
          </p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <FileImage className="mx-auto text-slate-300 mb-3" size={44} />
          <h3 className="text-base font-bold text-slate-800">
            No photos found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || categoryFilter !== "All" || statusFilter !== "All"
              ? "No photos match your active search and filter criteria. Try clearing filters."
              : "No gallery photos uploaded yet. Click '+ Upload New Photo' above to add your first photo."}
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsUploadModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 bg-[#0066FF] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-blue-600 transition">
            <Plus size={14} />
            <span>Upload Photo Now</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={optimizeCloudinaryImageUrl(img.image, 900)}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${img.isPublished
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-white"
                      }`}>
                    {img.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-semibold bg-white/95 text-slate-800 backdrop-blur-md px-2 py-0.5 rounded shadow-xs">
                    {img.category}
                  </span>
                </div>

                {/* Quick Hover Controls Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxItem(img)}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-800 shadow-xs transition"
                    title="View Fullsize">
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(img)}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-800 shadow-xs transition"
                    title="Edit Photo">
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(img.image, img.id)}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-800 shadow-xs transition"
                    title="Copy Image URL">
                    {copiedId === img.id ? (
                      <Check size={16} className="text-emerald-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(img)}
                    className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                    title="Delete Photo">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {img.title}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={12} className="text-slate-400" />
                    {img.date}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(img)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                      title="Edit photo">
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(img.id, img.isPublished)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${img.isPublished
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}>
                      {img.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{img.isPublished ? "Live" : "Hidden"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredImages.map((img) => (
                  <tr key={img.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <img
                        src={optimizeCloudinaryImageUrl(img.image, 1200)}
                        alt={img.title}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200 cursor-pointer"
                        onClick={() => setLightboxItem(img)}
                      />
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900">
                        {img.title}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[11px]">
                        {img.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {img.date}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleTogglePublish(img.id, img.isPublished)
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer ${img.isPublished
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}>
                        {img.isPublished ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        <span>{img.isPublished ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setLightboxItem(img)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
                          title="Preview">
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(img)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
                          title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(img.image, img.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
                          title="Copy Link">
                          {copiedId === img.id ? (
                            <Check size={15} className="text-emerald-600" />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(img)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50"
                          title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STAFF UPLOAD MODAL - FULLSCREEN ON MOBILE                      */}
      {/* ============================================================== */}
      {isUploadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeUploadModal();
          }}
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-black/60 sm:backdrop-blur-xs sm:items-center sm:justify-center sm:p-4 overflow-hidden animate-in fade-in duration-200">
          <div
            className="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 shadow-none sm:shadow-2xl max-w-2xl w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden"
            onMouseDown={(event) => event.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-white sm:bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center font-bold shrink-0">
                  <Upload size={16} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    <span id="gallery-modal-title">
                      {editingImageId
                        ? "Edit College Gallery Photo"
                        : "Upload Photo to College Gallery"}
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    {editingImageId
                      ? "Update photograph details and publication status."
                      : "Add photograph with title, category, and date."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={isSubmitting}
                aria-label="Close gallery form"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleUploadSubmit}
              className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-5 -webkit-overflow-scrolling-touch">
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Mode Selector (File vs URL) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Image Source
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("file");
                      setFormImageUrl("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${uploadMode === "file"
                        ? "bg-white text-[#0066FF] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}>
                    <Upload size={14} />
                    <span>Upload File from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("url");
                      setFormImageFile(null);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${uploadMode === "url"
                        ? "bg-white text-[#0066FF] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}>
                    <LinkIcon size={14} />
                    <span>Paste Image Web URL</span>
                  </button>
                </div>
              </div>

              {/* File Dropzone or URL Input */}
              {uploadMode === "file" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUploadInput"
                  />
                  <label
                    htmlFor="fileUploadInput"
                    className="border-2 border-dashed border-slate-300 hover:border-[#0066FF] bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-6 text-center block cursor-pointer transition">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center mx-auto mb-2">
                      <ImageIcon size={22} />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      Click to choose image file or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, WEBP, GIF (Max 5MB)
                    </p>
                    {formImageFile && (
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 size={13} />
                        <span>Selected: {formImageFile.name}</span>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image URL (Direct link to image)
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Paste image URL from college server, Google Drive CDN,
                    Unsplash, etc.
                  </span>
                </div>
              )}

              {/* Live Preview If image selected */}
              {formImagePreview && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Live Photo Preview
                  </div>
                  <div className="relative aspect-[16/9] max-h-52 overflow-hidden rounded-lg bg-black/10 flex items-center justify-center">
                    <img
                      src={optimizeCloudinaryImageUrl(formImagePreview, 1000)}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo / Activity Title{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. National Seminar on Innovative Pedagogies 2026"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]">
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Publish State Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Publish immediately to Public Website
                  </span>
                  <span className="text-[11px] text-slate-500">
                    If checked, photo will be visible to public users on the
                    live gallery.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="formIsPublished"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="w-5 h-5 text-[#0066FF] rounded border-slate-300 focus:ring-[#0066FF] cursor-pointer"
                />
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-4 sm:px-6 sm:py-4 bg-white sm:bg-slate-50/50 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition text-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#363991] hover:bg-[#2A3178] disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-5 py-3 sm:py-2 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <>
                      {editingImageId ? (
                        <Pencil size={15} />
                      ) : (
                        <Upload size={15} />
                      )}
                      <span>
                        {editingImageId
                          ? "Save changes"
                          : "Upload & Save Photo"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL                                      */}
      {/* ============================================================== */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900">
              Delete Gallery Photo?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-2">
              Are you sure you want to remove{" "}
              <strong className="text-slate-800">
                &quot;{deleteTarget.title}&quot;
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition cursor-pointer">
                {isDeleting ? "Deleting..." : "Yes, Delete Photo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FULLSCREEN PREVIEW LIGHTBOX                                    */}
      {/* ============================================================== */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setLightboxItem(null)}>
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3.5 bg-black/50 text-white border-b border-white/10">
              <span className="text-xs font-semibold truncate max-w-md">
                {lightboxItem.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="p-1 rounded text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] bg-black flex items-center justify-center p-2">
              <img
                src={optimizeCloudinaryImageUrl(lightboxItem.image, 1400)}
                alt={lightboxItem.title}
                className="max-h-[66vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-white text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold block">
                  {lightboxItem.category}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {lightboxItem.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopyLink(lightboxItem.image, lightboxItem.id)
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium">
                <Copy size={13} />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
