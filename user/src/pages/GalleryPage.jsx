import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

import { CollegiatePageLayout } from "../components/common/CollegiatePageLayout";
import { getCampusLifeSidebarConfig } from "../data/navigationConfig";
import { galleryItems as codeFileGallery } from "../data/galleryData";
import { cloudinaryImageUrl } from "../data/imagesData";
import { fetchBackendGalleryImages } from "../services/galleryService";
import { useLanguage } from "../context/LanguageContext";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GalleryPage() {
  const { isHindi } = useLanguage();
  const sidebarConfig = getCampusLifeSidebarConfig(isHindi);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendImages, setBackendImages] = useState([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [hasLoadedBackend, setHasLoadedBackend] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const localImages = useMemo(
    () =>
      codeFileGallery.map((item, index) => ({
        ...item,
        id: item.id ?? `local_${index}`,
        isFromCodeFile: true,
      })),
    [],
  );

  const loadBackendImages = useCallback(async () => {
    if (isLoadingBackend || hasLoadedBackend) return;
    setIsLoadingBackend(true);
    setBackendError("");

    try {
      const fetched = await fetchBackendGalleryImages({ limitCount: 40 });
      const localUrls = new Set(
        localImages.map((item) => item.image).filter(Boolean),
      );
      const uniqueImages = fetched
        .filter((item) => item.image && !localUrls.has(item.image))
        .map((item, index) => ({
          ...item,
          id: item.id ?? `backend_${index}`,
          isFromCodeFile: false,
        }));
      setBackendImages(uniqueImages);
      setHasLoadedBackend(true);
    } catch {
      setBackendError(
        isHindi
          ? "अतिरिक्त छायाचित्र लोड नहीं हो पाए।"
          : "Unable to load additional photos.",
      );
    } finally {
      setIsLoadingBackend(false);
    }
  }, [isLoadingBackend, hasLoadedBackend, localImages, isHindi]);

  useEffect(() => {
    loadBackendImages();
  }, [loadBackendImages]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        [...localImages, ...backendImages]
          .map((item) => item.category)
          .filter(Boolean),
      ),
    ];
    return ["All", ...uniqueCategories];
  }, [localImages, backendImages]);

  const filteredLocalImages = useMemo(() => {
    if (selectedCategory === "All") return localImages;
    return localImages.filter((item) => item.category === selectedCategory);
  }, [localImages, selectedCategory]);

  const filteredBackendImages = useMemo(() => {
    if (selectedCategory === "All") return backendImages;
    return backendImages.filter((item) => item.category === selectedCategory);
  }, [backendImages, selectedCategory]);

  const displayedImages = useMemo(
    () => [...filteredLocalImages, ...filteredBackendImages],
    [filteredLocalImages, filteredBackendImages],
  );

  const openLightbox = (image) => {
    const index = displayedImages.findIndex((item) => item.id === image.id);
    if (index !== -1) setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || !displayedImages.length) return null;
      return current > 0 ? current - 1 : displayedImages.length - 1;
    });
  }, [displayedImages.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || !displayedImages.length) return null;
      return current < displayedImages.length - 1 ? current + 1 : 0;
    });
  }, [displayedImages.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (lightboxIndex === null) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") prevImage();
      if (event.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  const activeImage =
    lightboxIndex !== null ? displayedImages[lightboxIndex] : null;

  return (
    <>
      <CollegiatePageLayout
        bannerTitle={isHindi ? "छायाचित्र दीर्घा" : "Photo Gallery"}
        bannerSubtitle={
          isHindi
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन के परिसर, शैक्षणिक गतिविधियों एवं सांस्कृतिक कार्यक्रमों की झलकियाँ।"
            : "Photographs of campus life, workshops, sports meets, laboratory sessions, and celebratory milestones."
        }
        breadcrumbs={[
          { label: isHindi ? "सुविधाएं एवं परिसर" : "Facilities", href: "/campus-life" },
          { label: isHindi ? "गैलरी" : "Gallery" },
        ]}
        sidebarTitle={sidebarConfig.title}
        sidebarItems={sidebarConfig.items}
        quickActions={sidebarConfig.quickActions}>
        <div className="space-y-6">
          {/* Category Filter Pills Card */}
          <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
            <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "श्रेणियाँ" : "Categories"}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {isHindi ? "गतिविधि-वार छायाचित्र" : "Event & Category Filter"}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-sans">
                {displayedImages.length} {isHindi ? "छायाचित्र उपलब्ध" : "photos displayed"}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((category) => {
                const active = selectedCategory === category;
                const categoryLabel =
                  category === "All"
                    ? isHindi
                      ? "सभी छायाचित्र"
                      : "All Photos"
                    : category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded text-xs font-bold font-sans transition whitespace-nowrap cursor-pointer border ${
                      active
                        ? "bg-[#2E3A8C] text-white border-[#2E3A8C] shadow-xs"
                        : "bg-white text-slate-700 border-gray-200 hover:border-[#2E3A8C] hover:text-[#2E3A8C]"
                    }`}>
                    {categoryLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="rounded-md border border-gray-200/90 bg-white p-6 sm:p-7 shadow-xs">
            {displayedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedImages.map((item, index) => (
                  <button
                    key={item.id ?? `${item.image}_${index}`}
                    type="button"
                    onClick={() => openLightbox(item)}
                    className="group overflow-hidden rounded border border-gray-200 bg-slate-50 text-left transition hover:border-[#2E3A8C] hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2E3A8C] cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={cloudinaryImageUrl(item.image, 800)}
                        width="600"
                        height="450"
                        alt={item.title || "College campus photo"}
                        loading={index < 6 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.isFromCodeFile && (
                        <span className="absolute left-2.5 top-2.5 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {isHindi ? "परिसर" : "Campus"}
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 bg-white">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#2E3A8C] line-clamp-1">
                        {item.title || (isHindi ? "परिसर का छायाचित्र" : "Campus Photo")}
                      </h4>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded border border-gray-200 p-10 text-center text-slate-400">
                <FolderOpen size={30} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs">
                  {isHindi
                    ? "इस श्रेणी में अभी कोई छायाचित्र उपलब्ध नहीं है।"
                    : "No photos are available in this category yet."}
                </p>
              </div>
            )}

            {/* Backend Loading Indicator */}
            {isLoadingBackend && (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-500">
                <Loader2 size={16} className="animate-spin text-[#2E3A8C]" />
                <span>
                  {isHindi ? "अधिक छायाचित्र लोड हो रहे हैं..." : "Loading more photos..."}
                </span>
              </div>
            )}

            {backendError && !isLoadingBackend && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <p className="flex items-center gap-1.5">
                  <AlertCircle size={15} />
                  <span>{backendError}</span>
                </p>
                <button
                  type="button"
                  onClick={loadBackendImages}
                  className="rounded bg-[#2E3A8C] px-3 py-1 font-bold text-white hover:bg-[#232d70] transition">
                  <RefreshCw size={13} className="inline mr-1" />
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </CollegiatePageLayout>

      {/* Lightbox Viewer */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="truncate font-serif font-bold text-sm text-slate-900">
                {activeImage.title}
              </h3>
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded p-1 text-slate-600 hover:bg-slate-100 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="relative flex min-h-[300px] flex-1 items-center justify-center bg-slate-950 p-2">
              <img
                src={cloudinaryImageUrl(activeImage.image, 1200)}
                alt={activeImage.title}
                className="max-h-[70vh] max-w-full object-contain"
              />

              {displayedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white cursor-pointer">
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white cursor-pointer">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
              <span>{formatDate(activeImage.date)}</span>
              <a
                href={activeImage.image}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#2E3A8C] hover:underline">
                Open Full Resolution
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
