import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [backendImages, setBackendImages] = useState([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [hasLoadedBackend, setHasLoadedBackend] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Use all images maintained in the local gallery data file.
  const localImages = useMemo(
    () =>
      codeFileGallery.map((item, index) => ({
        ...item,
        id: item.id ?? `local_${index}`,
        isFromCodeFile: true,
      })),
    [],
  );

  // Keep local and backend images separate to avoid duplicate images.
  const loadBackendImages = useCallback(async () => {
    if (isLoadingBackend || hasLoadedBackend) return;

    setIsLoadingBackend(true);
    setBackendError("");

    try {
      const fetched = await fetchBackendGalleryImages({
        limitCount: 40,
      });

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
    } catch (error) {
      setBackendError(
        isHindi
          ? "अतिरिक्त छायाचित्र लोड नहीं हो पाए। कृपया दोबारा प्रयास करें।"
          : "Unable to load additional photos. Please try again.",
      );
    } finally {
      setIsLoadingBackend(false);
    }
  }, [isLoadingBackend, hasLoadedBackend, localImages, isHindi]);

  // Load Admin-published photos immediately, after the local gallery is ready.
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

  // Show every local photo before appending Admin-published photos.
  const localCategoryImages = useMemo(
    () => filteredLocalImages,
    [filteredLocalImages],
  );

  // Once the backend loads, append its images to the displayed gallery.
  const displayedImages = useMemo(
    () => [...localCategoryImages, ...filteredBackendImages],
    [localCategoryImages, filteredBackendImages],
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
      <Helmet>
        <title>
          {isHindi
            ? "छायाचित्र दीर्घा | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Photo Gallery | Haryana Shakti College of Education"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की गतिविधियों, प्रयोगशालाओं, खेलों और परिसर की छायाचित्र दीर्घा देखें।"
              : "Explore campus facilities, laboratories, sports, practical learning and college activities at Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <PageHeaderBanner
        title={isHindi ? "छायाचित्र दीर्घा" : "Photo Gallery"}
        subtitle={
          isHindi
            ? "महाविद्यालय की गतिविधियों, सुविधाओं और परिसर की झलकियाँ।"
            : "A look at our campus, facilities and college activities."
        }
        breadcrumbs={[
          {
            label: isHindi ? "छायाचित्र दीर्घा" : "Photo Gallery",
          },
        ]}
      />

      <section className="bg-white py-8 sm:py-12">
        <Container>
          {/* Simple page heading */}
          <div className="mb-7 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ImageIcon size={17} />
              <span>{isHindi ? "महाविद्यालय संग्रह" : "College Gallery"}</span>
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {isHindi ? "परिसर की झलकियाँ" : "Campus Highlights"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isHindi
                    ? "श्रेणी चुनें और संबंधित छायाचित्र देखें।"
                    : "Choose a category to explore its photographs."}
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {displayedImages.length}{" "}
                {isHindi ? "छायाचित्र" : "photos shown"}
              </span>
            </div>
          </div>

          {/* Category sidebar + photo grid */}
          <div className="grid grid-cols-1 gap-7 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
            <aside>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                {isHindi ? "श्रेणियाँ" : "Categories"}
              </h3>

              <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible">
                {categories.map((category) => {
                  const active = selectedCategory === category;

                  const categoryLabel =
                    category === "All"
                      ? isHindi
                        ? "सभी छायाचित्र"
                        : "All Photos"
                      : category;

                  const count =
                    category === "All"
                      ? localImages.length + backendImages.length
                      : [...localImages, ...backendImages].filter(
                          (item) => item.category === category,
                        ).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`flex shrink-0 items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors md:w-full ${
                        active
                          ? "border-[#292C75] bg-[#292C75] font-semibold text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-[#292C75] hover:bg-slate-50"
                      }`}>
                      <span>{categoryLabel}</span>
                      <span
                        className={`text-xs ${
                          active ? "text-white/75" : "text-slate-400"
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 hidden border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500 md:block">
                {isHindi
                  ? "व्यवस्थापक द्वारा प्रकाशित छायाचित्र स्थानीय छायाचित्रों के बाद दिखेंगे।"
                  : "Admin-published photos appear after the local campus photos."}
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCategory === "All"
                    ? isHindi
                      ? "छायाचित्र"
                      : "Gallery Photos"
                    : selectedCategory}
                </h3>

                <span className="text-xs text-slate-500">
                  {localCategoryImages.length}{" "}
                  {isHindi ? "स्थानीय छायाचित्र" : "local photos"}
                </span>
              </div>

              {displayedImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {displayedImages.map((item, index) => (
                    <button
                      key={item.id ?? `${item.image}_${index}`}
                      type="button"
                      onClick={() => openLightbox(item)}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-slate-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#292C75] focus:ring-offset-2"
                      aria-label={`${isHindi ? "छायाचित्र देखें" : "View photo"}: ${item.title}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={cloudinaryImageUrl(item.image, 1000)}
                          width="800"
                          height="600"
                          alt={item.title || "College campus"}
                          loading={index < 4 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />

                        {item.isFromCodeFile && (
                          <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                            {isHindi ? "स्थानीय" : "Local"}
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h4 className="font-semibold leading-snug text-slate-900 group-hover:text-[#292C75]">
                          {item.title ||
                            (isHindi ? "परिसर का छायाचित्र" : "Campus Photo")}
                        </h4>

                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar size={13} />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 p-10 text-center">
                  <FolderOpen
                    size={32}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="text-sm text-slate-500">
                    {isHindi
                      ? "इस श्रेणी में अभी कोई छायाचित्र उपलब्ध नहीं है।"
                      : "No photos are available in this category yet."}
                  </p>
                </div>
              )}

              {/* Admin-published photos are appended after local photos. */}
              <div className="mt-10 border-t border-slate-200 pt-6">
                {isLoadingBackend && (
                  <div className="flex items-center justify-center gap-3 py-6 text-sm text-slate-500">
                    <Loader2
                      size={20}
                      className="animate-spin text-[#292C75]"
                    />
                    <span>
                      {isHindi
                        ? "अधिक छायाचित्र लोड हो रहे हैं..."
                        : "Loading more campus photos..."}
                    </span>
                  </div>
                )}

                {backendError && !isLoadingBackend && (
                  <div className="flex flex-col items-start justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle size={18} />
                      {backendError}
                    </p>

                    <button
                      type="button"
                      onClick={loadBackendImages}
                      className="inline-flex items-center gap-2 rounded-md bg-[#292C75] px-4 py-2 text-sm font-medium text-white hover:bg-[#363991]">
                      <RefreshCw size={15} />
                      {isHindi ? "दोबारा प्रयास करें" : "Retry"}
                    </button>
                  </div>
                )}

                {!hasLoadedBackend && !isLoadingBackend && !backendError && (
                  <div className="py-4 text-center">
                    <p className="text-sm text-slate-500">
                      {isHindi
                        ? "अधिक छायाचित्र देखने के लिए नीचे स्क्रॉल करें।"
                        : "Published photos from Admin appear after the local campus photos."}
                    </p>
                  </div>
                )}

                {hasLoadedBackend && (
                  <p className="py-4 text-center text-sm text-slate-500">
                    {filteredBackendImages.length > 0
                      ? isHindi
                        ? "सभी उपलब्ध छायाचित्र लोड हो गए हैं।"
                        : "All photos returned by the gallery service are loaded."
                      : isHindi
                        ? "इस श्रेणी में अतिरिक्त छायाचित्र उपलब्ध नहीं हैं।"
                        : "No additional photos were found in this category."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Simple fullscreen image viewer */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title || "Photo viewer"}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6">
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-900">
                  {activeImage.title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {lightboxIndex + 1} / {displayedImages.length}
                  {activeImage.category ? ` · ${activeImage.category}` : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo viewer"
                className="shrink-0 rounded-md p-2 text-slate-600 hover:bg-slate-100">
                <X size={21} />
              </button>
            </div>

            <div className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden bg-slate-950 p-3 sm:min-h-[350px]">
              <img
                src={cloudinaryImageUrl(activeImage.image, 1200)}
                width="1200"
                height="900"
                alt={activeImage.title || "College campus"}
                className="max-h-[68vh] max-w-full object-contain"
              />

              {displayedImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-slate-900 shadow hover:bg-white">
                    <ChevronLeft size={23} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 text-slate-900 shadow hover:bg-white">
                    <ChevronRight size={23} />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {activeImage.date && (
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(activeImage.date)}
                  </p>
                )}
              </div>

              <a
                href={activeImage.image}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#292C75] hover:underline">
                {isHindi ? "मूल छायाचित्र खोलें" : "Open original image"}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
