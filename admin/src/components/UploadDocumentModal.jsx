import React, { useState } from "react";
import {
  X,
  FileText,
  FolderOpen,
  Calendar,
  Cloud,
  HardDrive,
  CheckCircle2,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";
import AdobePdfIcon from "./common/AdobePdfIcon";

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onDocumentUploaded,
  currentUser,
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Institutional Information");
  const [session, setSession] = useState("2026-27");
  const [publicationDate, setPublicationDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [storageDestination, setStorageDestination] = useState("both");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a document title.");
      return;
    }

    setSubmitting(true);
    setError("");

    const newDocItem = {
      id: "doc_local_" + Date.now(),
      title: title.trim(),
      category,
      session,
      publicationDate,
      description: description.trim(),
      url: pdfUrl.trim() || "/documents/HSCE_Document_" + Date.now() + ".pdf",
      uploadedBy: currentUser?.email || "staff@hsce.edu.in",
      createdAt: new Date().toISOString(),
      source: storageDestination === "backend" ? "backend" : "frontend",
    };

    try {
      let backendSaved = false;
      if (
        (storageDestination === "backend" || storageDestination === "both") &&
        firebaseReady
      ) {
        try {
          const docRef = await addDoc(collection(db, "documents"), {
            title: title.trim(),
            category,
            session,
            publicationDate,
            description: description.trim(),
            url: newDocItem.url,
            uploadedBy: currentUser?.email || "staff@hsce.edu.in",
            createdAt: serverTimestamp(),
            source: "backend",
          });
          newDocItem.id = docRef.id;
          newDocItem.source = "backend";
          backendSaved = true;
        } catch (backendErr) {
          console.warn(
            "Firestore documents write warning:",
            backendErr.message,
          );
        }
      }

      if (
        storageDestination === "frontend" ||
        storageDestination === "both" ||
        !backendSaved
      ) {
        const stored = JSON.parse(
          localStorage.getItem("hsce_staff_documents_local") || "[]",
        );
        const updated = [newDocItem, ...stored];
        localStorage.setItem(
          "hsce_staff_documents_local",
          JSON.stringify(updated),
        );
      }

      onDocumentUploaded(newDocItem);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to upload document. " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}>
      <div
        className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0066FF] via-[#0252cf] to-[#1E3A8A] text-white p-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm transition-colors"
            aria-label="Close modal">
            <X size={18} />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-sm">
              <FileText size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-blue-100 backdrop-blur-sm mb-1">
                <Sparkles size={11} />
                <span>Document Repository</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Upload College Document
              </h2>
              <p className="text-xs text-blue-100">
                Upload official PDFs, regulatory disclosures, affidavits, and
                syllabus
              </p>
            </div>
          </div>
        </div>

        {/* Success / Error Messages */}
        {success && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 px-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Document successfully uploaded and indexed!</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3 px-6 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 -webkit-overflow-scrolling-touch">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <FileText size={13} className="text-[#0066FF]" />
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="portal-input !py-2.5"
              placeholder="e.g. NCTE Mandatory Disclosure 2026-27"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <FolderOpen size={13} className="text-[#0066FF]" />
                Disclosure Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="portal-input !py-2.5">
                <option value="Institutional Information">
                  Institutional Information
                </option>
                <option value="Recognition and Affiliation">
                  Recognition &amp; Affiliation
                </option>
                <option value="Course and Intake">
                  Course &amp; Intake Details
                </option>
                <option value="Academic">Academic Curriculum</option>
                <option value="Other">Other Disclosures</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <Calendar size={13} className="text-[#0066FF]" />
                Academic Session
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="portal-input !py-2.5"
                placeholder="2026-27"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <AdobePdfIcon size={16} />
                <span>PDF Document Link (Google Drive or Web URL)</span>
              </label>
              {pdfUrl.trim() && (
                <a
                  href={pdfUrl.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:underline">
                  Preview Link ↗
                </a>
              )}
            </div>
            <input
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="portal-input !py-2.5 font-mono text-xs"
              placeholder="https://drive.google.com/file/d/.../view or https://..."
            />
            <p className="mt-1 text-[11px] text-slate-500">
              💡 Paste your Google Drive sharing link or direct PDF document URL. (Ensure sharing is set to &ldquo;Anyone with the link can view&rdquo;).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="portal-input font-normal text-xs leading-relaxed"
              placeholder="Details regarding this document, regulatory reference or circular number..."
            />
          </div>

          <div className="shrink-0 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all focus:outline-none cursor-pointer text-center"
            >
              <FileText size={14} />
              <span>{submitting ? "Uploading..." : "Upload Document"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
