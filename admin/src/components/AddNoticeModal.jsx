import React, { useState, useRef, useEffect } from "react";
import {
  X,
  FileText,
  CheckCircle2,
  Paperclip,
  UploadCloud,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";
import { uploadToCloudinary } from "../services/cloudinary";
import AdobePdfIcon from "./common/AdobePdfIcon";

const NOTICE_CATEGORIES = [
  "General Notice",
  "Admission",
  "Examination",
  "Results",
  "Academic",
  "Scholarship",
  "Recruitment",
  "Events",
  "Holiday",
  "Circular",
  "Important Announcement",
];

function toNoticeSlug(title, id) {
  const titleSlug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${titleSlug || "notice"}-${id}`;
}

function localDateValue() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function AddNoticeModal({
  isOpen,
  onClose,
  onNoticeCreated,
  onNoticeUpdated,
  noticeToEdit = null,
  currentUser,
  staffProfile,
  isPrincipal = false,
  defaultType = "latest",
  modalTitle,
}) {
  const isEditing = Boolean(noticeToEdit);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(
    defaultType === "admission" ? "Admission" : "General Notice",
  );
  const [publicationDate, setPublicationDate] = useState(localDateValue);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [importantDate, setImportantDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [attachmentMetadata, setAttachmentMetadata] = useState(null);
  const [officialUrl, setOfficialUrl] = useState("");
  const [status, setStatus] = useState("published");
  const [isPinned, setIsPinned] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authorName =
    staffProfile?.name || currentUser?.displayName || "HSCE Administration";

  // Pre-fill fields when editing or reset when adding
  useEffect(() => {
    if (noticeToEdit) {
      setTitle(noticeToEdit.title || "");
      setDescription(noticeToEdit.description || "");
      setCategory(noticeToEdit.category || "General Notice");
      setPublicationDate(noticeToEdit.publicationDate || localDateValue());
      setReferenceNumber(noticeToEdit.referenceNumber || "");
      setDepartment(noticeToEdit.department || "");
      setImportantDate(noticeToEdit.importantDate || "");
      setPdfUrl(noticeToEdit.pdfUrl || "");
      setAttachmentMetadata(noticeToEdit.attachmentMetadata || null);
      setOfficialUrl(noticeToEdit.officialUrl || "");
      setStatus(
        noticeToEdit.status ||
          (noticeToEdit.isPublished === false ? "draft" : "published"),
      );
      setIsPinned(noticeToEdit.isPinned === true);
      setFileName(noticeToEdit.pdfUrl ? "Attached Document" : "");
    } else {
      setTitle("");
      setDescription("");
      setCategory(defaultType === "admission" ? "Admission" : "General Notice");
      setPublicationDate(localDateValue());
      setReferenceNumber("");
      setDepartment("");
      setImportantDate("");
      setPdfUrl("");
      setAttachmentMetadata(null);
      setOfficialUrl("");
      setStatus("published");
      setIsPinned(false);
      setFileName("");
    }
    setError("");
  }, [noticeToEdit, isOpen]);

  // Upload file (PDF or Image) to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError("");
    setFileName(file.name);

    try {
      const result = await uploadToCloudinary(file, {
        folder: defaultType === "admission" ? "hsce_admission" : "hsce_notices",
      });

      if (result?.secure_url) {
        setPdfUrl(result.secure_url);
        setAttachmentMetadata({
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resourceType: result.resource_type,
        });
      }
    } catch (err) {
      setFileName("");
      setAttachmentMetadata(null);
      setError(err.message || "The attachment could not be uploaded.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both the notice title and details.");
      return;
    }
    if (!firebaseReady || !currentUser?.uid) {
      setError("Sign in with an authorized account to publish notices.");
      return;
    }
    if (!publicationDate) {
      setError("Choose the notice publication date.");
      return;
    }
    if (officialUrl && !/^https?:\/\//i.test(officialUrl.trim())) {
      setError(
        "Enter a valid official link beginning with http:// or https://.",
      );
      return;
    }
    if (status !== "published" && pdfUrl.trim()) {
      setError(
        "Remove the public attachment URL before saving this notice as a draft or archived record.",
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const isPublished = status === "published";
      const timestamp = serverTimestamp();
      const commonFields = {
        title: title.trim(),
        description: description.trim(),
        category,
        publicationDate,
        referenceNumber: referenceNumber.trim(),
        department: department.trim(),
        importantDate,
        pdfUrl: pdfUrl.trim(),
        attachmentMetadata,
        officialUrl: officialUrl.trim(),
        isPinned,
        status,
        isPublished,
        createdAt:
          typeof noticeToEdit?.createdAt?.toDate === "function"
            ? noticeToEdit.createdAt
            : timestamp,
        authorUid: noticeToEdit?.authorUid || currentUser.uid,
        authorName: noticeToEdit?.authorName || authorName,
        publishedAt: isPublished
          ? timestamp
          : typeof noticeToEdit?.publishedAt?.toDate === "function"
            ? noticeToEdit.publishedAt
            : null,
        updatedAt: timestamp,
      };

      if (isEditing) {
        const updatedNotice = {
          ...noticeToEdit,
          ...commonFields,
          updatedAt: new Date().toISOString(),
          publishedAt: isPublished
            ? new Date().toISOString()
            : typeof noticeToEdit.publishedAt?.toDate === "function"
              ? noticeToEdit.publishedAt
              : null,
        };

        await setDoc(doc(db, "notices", noticeToEdit.id), commonFields, {
          merge: true,
        });

        if (onNoticeUpdated) {
          onNoticeUpdated(updatedNotice);
        }
        onClose();
        return;
      }

      const noticeRef = doc(collection(db, "notices"));
      const newNotice = {
        id: noticeRef.id,
        ...commonFields,
        slug: toNoticeSlug(title.trim(), noticeRef.id),
        type: defaultType,
        authorUid: currentUser.uid,
        authorName,
        createdAt: new Date().toISOString(),
        publishedAt: isPublished ? new Date().toISOString() : null,
        source: "backend",
      };

      await setDoc(noticeRef, {
        ...commonFields,
        slug: newNotice.slug,
        type: defaultType,
        authorUid: currentUser.uid,
        authorName,
        createdAt: timestamp,
      });

      if (onNoticeCreated) {
        onNoticeCreated(newNotice);
      }
      onClose();
    } catch (submitError) {
      setError(
        submitError.message || "Could not save notice. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}>
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}>
        {/* Simple Clean Header */}
        <div className="bg-[#0066FF] text-white px-5 sm:px-6 pt-3 pb-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="w-10 h-1 bg-white/40 rounded-full mx-auto mb-2.5 sm:hidden" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <FileText size={18} className="shrink-0" />
              <h3 className="text-sm sm:text-base font-bold truncate">
                {modalTitle ||
                  (isEditing
                    ? "Edit Notice"
                    : defaultType === "admission"
                      ? "Upload Admission Notice"
                      : "Upload Latest Notice")}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 shrink-0 ml-2">
              <X size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs px-5 sm:px-6 py-2.5 border-b border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Simple Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter notice title"
              className="portal-input !py-2.5 text-xs font-medium"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold text-slate-700">
              Category *
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="portal-input mt-1 !py-2.5 text-xs">
                {NOTICE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-700">
              Publication date *
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                required
                className="portal-input mt-1 !py-2.5 text-xs"
              />
            </label>
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notice content or short description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter notice details, instructions, or information..."
              className="portal-input text-xs font-normal leading-relaxed"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Reference number (optional)"
              className="portal-input !py-2.5 text-xs"
            />
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department / issuing authority"
              className="portal-input !py-2.5 text-xs"
            />
            <label className="block text-xs font-bold text-slate-700">
              Important date or deadline
              <input
                type="date"
                value={importantDate}
                onChange={(e) => setImportantDate(e.target.value)}
                className="portal-input mt-1 !py-2.5 text-xs"
              />
            </label>
            <label className="block text-xs font-bold text-slate-700">
              Publication status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="portal-input mt-1 !py-2.5 text-xs">
                <option value="published">Publish immediately</option>
                <option value="draft">Save as draft</option>
                {isPrincipal && (
                  <option value="archived">Archive notice</option>
                )}
              </select>
            </label>
            <input
              type="url"
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              placeholder="Official external link (optional)"
              className="portal-input !py-2.5 text-xs sm:col-span-2"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
            />
            Highlight this notice
          </label>

          {/* PDF Document Link (Google Drive / Web URL) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <AdobePdfIcon size={16} />
                <span>PDF Document Link (Google Drive or Web URL)</span>
              </label>
              {pdfUrl.trim() && (
                <a
                  href={pdfUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline">
                  <span>Preview Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <input
              type="url"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view or https://example.com/notice.pdf"
              className="portal-input !py-2 text-xs font-mono text-slate-800 bg-white"
            />

            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>Tip:</strong> You can paste a public Google Drive sharing link or any web document URL. (Ensure Google Drive sharing is set to <em>&ldquo;Anyone with the link can view&rdquo;</em>).
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingFile}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold shadow-xs transition-colors">
              {submitting
                ? isEditing
                  ? "Saving Changes..."
                  : "Publishing..."
                : isEditing
                  ? "Save Changes"
                  : "Publish Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
