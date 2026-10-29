import React, { useEffect, useState, useRef } from "react";
import {
  PanelsTopLeft,
  Upload,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Power,
  ExternalLink,
  Sparkles,
  HelpCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, firebaseReady, storage } from "../config/firebase";
import {
  optimizeCloudinaryImageUrl,
  uploadToCloudinary,
} from "../services/cloudinary";

export default function HomepagePopupPage({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing popup data from Firestore (fixed doc "active")
  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return undefined;
    }

    const popupDocRef = doc(db, "homepagePopups", "active");
    const unsubscribe = onSnapshot(
      popupDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImageUrl(data.image || data.imageUrl || "");
          setRedirectUrl(data.linkUrl || data.redirectLink || "");
          setIsEnabled(data.isPublished !== false && data.status !== "inactive");
        } else {
          setImageUrl("");
          setRedirectUrl("");
          setIsEnabled(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error loading homepage popup:", err);
        setError("Failed to load popup settings from database.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle local file preview
  useEffect(() => {
    if (!selectedFile) {
      setFilePreview("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Image size must be less than 15 MB.");
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!firebaseReady) {
      setError("Firebase is not initialized. Please check credentials.");
      return;
    }

    const activeImage = selectedFile || imageUrl.trim();
    if (!activeImage) {
      setError("Please select or upload a popup image before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      let finalImageUrl = imageUrl.trim();

      // Upload newly selected file if provided
      if (selectedFile) {
        try {
          const uploadRes = await uploadToCloudinary(selectedFile, {
            folder: "hsce/homepage-popup",
            resourceType: "image",
          });
          if (uploadRes?.secure_url) {
            finalImageUrl = uploadRes.secure_url;
          }
        } catch (cloudErr) {
          console.warn("Cloudinary fallback to Firebase Storage:", cloudErr);
          const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          const storagePath = `public/homepage-popup/active-${Date.now()}-${safeName}`;
          const fileRef = ref(storage, storagePath);
          await uploadBytes(fileRef, selectedFile, { contentType: selectedFile.type });
          finalImageUrl = await getDownloadURL(fileRef);
        }
      }

      if (!finalImageUrl) {
        throw new Error("Could not process image upload. Please try again.");
      }

      const formattedRedirect = redirectUrl.trim();
      const popupDocRef = doc(db, "homepagePopups", "active");

      const payload = {
        image: finalImageUrl,
        imageUrl: finalImageUrl,
        linkUrl: formattedRedirect,
        redirectLink: formattedRedirect,
        isPublished: isEnabled,
        status: isEnabled ? "published" : "inactive",
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || "Admin",
      };

      await setDoc(popupDocRef, payload, { merge: true });

      setImageUrl(finalImageUrl);
      setSelectedFile(null);
      setFilePreview("");
      setNotice(
        isEnabled
          ? "Homepage popup saved and activated on live website!"
          : "Popup saved (Currently Inactive / Hidden)."
      );
    } catch (saveErr) {
      console.error("Popup save error:", saveErr);
      setError(saveErr.message || "Failed to save popup.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);

    // If there is already an existing popup saved, update status immediately in Firestore
    if (imageUrl) {
      try {
        setSaving(true);
        const popupDocRef = doc(db, "homepagePopups", "active");
        await setDoc(
          popupDocRef,
          {
            isPublished: nextState,
            status: nextState ? "published" : "inactive",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setNotice(
          nextState
            ? "Homepage popup is now Active on the website!"
            : "Homepage popup is now Disabled / Hidden."
        );
      } catch (err) {
        setError("Failed to update status. Please try again.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleClearPopup = async () => {
    if (!window.confirm("Are you sure you want to completely remove this homepage popup?")) {
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const popupDocRef = doc(db, "homepagePopups", "active");
      await deleteDoc(popupDocRef);
      setImageUrl("");
      setRedirectUrl("");
      setSelectedFile(null);
      setFilePreview("");
      setNotice("Homepage popup removed successfully.");
    } catch (err) {
      setError("Failed to remove popup.");
    } finally {
      setSaving(false);
    }
  };

  const displayedImage = filePreview || imageUrl;

  return (
    <div className="content-manager academic-admin-page max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#194178] mb-1">
            <PanelsTopLeft size={16} />
            <span>WEBSITE ENGAGEMENT</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Homepage Popup / Modal Banner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displays an attractive flyer or promotional banner when visitors land on the homepage.
          </p>
        </div>

        {/* Quick Status Pill */}
        <div className="flex items-center gap-2">
          {displayedImage && (
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                isEnabled
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
              }`}>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isEnabled ? "Popup is Active (Live)" : "Popup is Disabled (Hidden)"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notice && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-sm font-semibold text-slate-500">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#194178] mr-2" />
          Loading popup configuration...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: ONLY 2 FIELDS FORM */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-[#194178]" />
                <span>Popup Settings (Image & Redirect)</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Only 2 simple fields
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* FIELD 1: IMAGE (UPLOAD & URL) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  1. Popup Image / Flyer <span className="text-rose-600">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Upload an image banner (JPG, PNG, WebP) or paste an image URL.
                </p>

                {/* Drag & Drop File Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                    isDragging
                      ? "border-[#194178] bg-blue-50/50"
                      : "border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-slate-100/60"
                  }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-[#194178] mb-2 group-hover:scale-105 transition">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : "Click to browse or drag & drop image here"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Recommended: 800×1000px or 1000×1000px (Max 15 MB)
                  </p>
                </div>

                {/* Direct Image URL input as alternative */}
                <div className="mt-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <ImageIcon size={14} />
                    </span>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setSelectedFile(null);
                        setFilePreview("");
                      }}
                      placeholder="Or paste direct image URL (e.g. https://res.cloudinary.com/...)"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#194178] focus:ring-2 focus:ring-[#194178]/10"
                    />
                  </div>
                </div>
              </div>

              {/* FIELD 2: REDIRECT LINK (URL) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  2. Redirect Link / Target URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  When visitors click the popup image, they will be redirected to this link.
                </p>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon size={15} />
                  </span>
                  <input
                    type="text"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="e.g. /admissions, /book-a-tour, /course/bed, or https://example.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#194178] focus:ring-4 focus:ring-[#194178]/10"
                  />
                </div>

                {redirectUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Destination:</span>
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#194178] hover:underline">
                      <span>{redirectUrl}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>

              {/* ACTIVE STATUS TOGGLE */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Popup Display Status</p>
                  <p className="text-[11px] text-slate-500">
                    {isEnabled ? "Currently active and visible to homepage visitors" : "Temporarily disabled / hidden"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? "bg-emerald-600" : "bg-slate-300"
                  }`}>
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* SAVE & DELETE ACTIONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || (!selectedFile && !imageUrl)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#194178] py-3 px-5 text-xs font-bold text-white shadow transition hover:bg-[#12345f] focus:outline-none focus:ring-4 focus:ring-[#194178]/20 disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span>Saving & Publishing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Save & Publish to Homepage</span>
                    </>
                  )}
                </button>

                {displayedImage && (
                  <button
                    type="button"
                    onClick={handleClearPopup}
                    disabled={saving}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white py-3 px-4 text-xs font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-300">
                    <Trash2 size={15} />
                    <span>Remove Popup</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: LIVE HOMEPAGE PREVIEW */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Eye size={15} className="text-[#FBDD23]" />
                  <span className="text-xs font-bold tracking-wide">Live Homepage Preview</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Visitor View
                </span>
              </div>

              {/* Mockup screen */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/5] flex items-center justify-center p-4">
                {displayedImage ? (
                  <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src={optimizeCloudinaryImageUrl(displayedImage, 1200)}
                      alt="Popup preview"
                      className="max-h-[380px] w-auto object-contain mx-auto"
                    />

                    {/* Mock close button */}
                    <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                      <X size={14} />
                    </div>

                    {/* Mock redirect banner */}
                    {redirectUrl && (
                      <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 text-center text-[10px] text-white flex items-center justify-center gap-1">
                        <LinkIcon size={11} className="text-[#FBDD23]" />
                        <span className="truncate">Redirects to: {redirectUrl}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-500">
                    <ImageIcon size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold">No active popup image</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      Upload an image or paste a URL to see the live preview.
                    </p>
                  </div>
                )}
              </div>

              {/* Status info beneath preview */}
              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Status:</span>
                <span className={isEnabled ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {displayedImage
                    ? isEnabled
                      ? "🟢 Visible to visitors on homepage"
                      : "⚪ Inactive / Hidden"
                    : "No popup configured"}
                </span>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-[#194178]" />
                How the Homepage Popup works:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 pl-1">
                <li>Appears smoothly ~0.7 seconds after visitors open the homepage.</li>
                <li>When clicked, it seamlessly navigates to your redirect link.</li>
                <li>Visitors can close it anytime by clicking ✕, the backdrop, or pressing ESC.</li>
                <li>Whenever you save a new image or link, it updates on the live website immediately.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
