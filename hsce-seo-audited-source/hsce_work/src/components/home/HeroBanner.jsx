import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { heroSlides } from "../../data/heroBannerData";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

const SLIDE_INTERVAL = 5000;

export function HeroBanner({ slides = heroSlides }) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const totalSlides = Array.isArray(slides) ? slides.length : 0;

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Slider autoplay
  useEffect(() => {
    if (isHovered || totalSlides <= 1 || prefersReducedMotion) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, totalSlides, prefersReducedMotion]);

  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  // Slider controls
  const goPrev = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }, [totalSlides]);

  const goNext = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? 0;
    touchEndXRef.current = touchStartXRef.current;
  };

  const handleTouchMove = (event) => {
    touchEndXRef.current = event.touches[0]?.clientX ?? touchEndXRef.current;
  };

  const handleTouchEnd = () => {
    const difference = touchStartXRef.current - touchEndXRef.current;

    if (difference > 50) goPrev();
    if (difference < -50) goNext();
  };

  // Redirect directly to /search page
  const handleSearchRedirect = (event) => {
    if (event) event.preventDefault();
    const trimmed = searchInput.trim();

    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchInput("");
    } else {
      navigate("/search");
    }
  };

  const text = {
    tour: isHindi ? "कैंपस टूर देखें" : "VIEW CAMPUS TOUR",
    admission: isHindi ? "प्रवेश (एडमिशन)" : "ADMISSION",
    placeholder: isHindi
      ? "कोर्स, प्रवेश, पेज खोजें..."
      : "Search courses, admissions, pages...",
    prev: isHindi ? "पिछला बैनर" : "Previous banner",
    next: isHindi ? "अगला बैनर" : "Next banner",
  };

  if (totalSlides === 0) return null;

  return (
    <section
      aria-label="College banner"
      className="w-full bg-[#F7F8FC] px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5">
      <div
        className="relative isolate w-full rounded-xl border border-[#E6E9F0] bg-[#194178] shadow-md sm:rounded-2xl lg:rounded-[22px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {/* Banner slides */}
        <div className="overflow-hidden rounded-[inherit]">
          <div
            className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id ? `banner-slide-${slide.id}-${index}` : `banner-${index}`}
                className="relative w-full shrink-0"
                aria-hidden={currentIndex !== index}>
                {/* Institutional Navy & Dark Gradient Overlays for Readability */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0F2547]/90 via-[#194178]/45 to-transparent" />
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0B1B36]/90 via-black/15 to-transparent" />

                {/* TEXT CONTENT OVERLAY */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 pb-20 pt-10 sm:px-10 lg:px-20">
                  <div className="flex w-fit max-w-full items-center rounded-xl bg-[#0B1B36]/70 px-4 py-3 backdrop-blur-xs sm:px-6 sm:py-4">
                    {/* Vertical Gold Accent Line */}
                    <div className="mr-5 h-20 w-2 shrink-0 rounded-sm bg-[#FBDD23] shadow-sm sm:mr-8 sm:h-28 sm:w-3" />

                    {/* Serif Heading */}
                    <h2                     className="font-serif text-3xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl lg:leading-[1.1]">
                      {slide.title ? (
                        slide.title
                      ) : isHindi ? (
                        <>
                          व्यावसायिक शिक्षण के लिए{" "}
                          <br className="hidden sm:block" />
                          आपकी सर्वोत्तम पसंद
                        </>
                      ) : (
                        <>
                          Your Choice for <br className="hidden sm:block" />
                          Professional Career
                        </>
                      )}
                    </h2>
                  </div>
                </div>

                <picture>
                  <source
                    media="(max-width: 639px)"
                    srcSet={slide.mobileImage || slide.desktopImage}
                  />
                  <img
                    src={slide.desktopImage}
                    width="1400"
                    height="700"
                    sizes="100vw"
                    alt={slide.alt || `College banner ${index + 1}`}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable="false"
                    className="block h-[460px] w-full select-none object-cover object-center sm:h-[520px] lg:h-[min(72svh,720px)] lg:min-h-[500px]"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop previous/next controls */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={text.prev}
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#194178]/70 text-white backdrop-blur-sm transition-colors hover:border-[#FBDD23] hover:bg-[#194178] hover:text-[#FBDD23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex lg:left-5">
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label={text.next}
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#194178]/70 text-white backdrop-blur-sm transition-colors hover:border-[#FBDD23] hover:bg-[#194178] hover:text-[#FBDD23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex lg:right-5">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Bottom actions bar */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-5 sm:px-8 sm:pb-7 lg:px-12 lg:pb-10">
          <div className="mx-auto flex max-w-[1250px] flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4 lg:gap-6">
            {/* Campus tour: desktop/tablet */}
            <Link
              to="/book-a-tour"
              className="group hidden min-h-[48px] w-full items-center justify-between gap-4 rounded-full border border-white/75 bg-[#194178]/80 py-1 pl-5 pr-1 text-white shadow-md backdrop-blur-md transition-all hover:border-[#FBDD23] hover:bg-[#194178] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex md:w-auto md:min-w-[215px]">
              <span className="text-xs font-bold tracking-wider">
                {text.tour}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#194178] transition-transform group-hover:translate-x-0.5 group-hover:bg-[#FBDD23]">
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Desktop search bar -> redirects straight to /search */}
            <div className="relative hidden w-full md:mx-1 md:block md:max-w-[460px] md:flex-1 lg:mx-2">
              <form
                role="search"
                onSubmit={handleSearchRedirect}
                onClick={() => {
                  if (!searchInput.trim()) navigate("/search");
                }}
                className="group flex min-h-[48px] w-full cursor-pointer items-center rounded-full border border-white/65 bg-white/95 px-5 py-1.5 shadow-lg backdrop-blur-md transition-all hover:border-[#FBDD23] focus-within:border-[#FBDD23] focus-within:ring-2 focus-within:ring-[#FBDD23]/40">
                <Search size={18} className="mr-3 shrink-0 text-[#194178]" />

                <input
                  type="text"
                  name="bannerSearch"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={text.placeholder}
                  aria-label="Search pages on this website"
                  className="w-full min-w-0 cursor-pointer bg-transparent py-1 text-sm font-medium text-[#25283A] outline-none placeholder:text-[#68728A] focus:cursor-text"
                />

                <button
                  type="submit"
                  aria-label="Go to search page"
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#194178] text-[#FBDD23] transition-colors group-hover:bg-[#343B91]">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Admission button: desktop/tablet */}
            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="group hidden min-h-[48px] w-full cursor-pointer items-center justify-between gap-4 rounded-full border-2 border-[#FBDD23] bg-[#0a4b8c] py-1 pl-5 pr-1 text-white shadow-lg transition-all hover:bg-[#073665] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex md:w-auto md:min-w-[210px]">
              <span className="text-xs font-bold tracking-wider">
                {text.admission}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] text-[#0a4b8c] transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={18} strokeWidth={2.5} />
              </span>
            </button>

            {/* Mobile: Direct redirect button to /search */}
            <Link
              to="/search"
              aria-label="Go to search page"
              className="flex min-h-[50px] w-full items-center gap-3 rounded-full border-2 border-[#FBDD23] bg-white/95 px-4 py-2 text-[#0a4b8c] shadow-lg backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:hidden">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a4b8c] text-[#FBDD23]">
                <Search size={17} />
              </span>

              <span className="flex-1 truncate text-left text-sm font-semibold text-[#25283A]">
                {text.placeholder}
              </span>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] text-[#0a4b8c]">
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop slide indicators */}
        {totalSlides > 1 && (
          <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:right-6 md:flex lg:right-20">
            {slides.map((slide, index) => (
              <button
                key={slide?.id ? `banner-line-${slide.id}-${index}` : `banner-line-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className="group rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23]">
                <span
                  className={`block h-[2px] rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-8 bg-[#FBDD23]"
                      : "w-4 bg-white/65 group-hover:w-6 group-hover:bg-white"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile slide indicators */}
        {totalSlides > 1 && (
          <div className="absolute inset-x-0 top-3 z-20 flex justify-center gap-2 md:hidden">
            {slides.map((slide, index) => (
              <button
                key={slide?.id ? `banner-dot-${slide.id}-${index}` : `banner-dot-${index}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className="p-1">
                <span
                  className={`block h-1.5 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-6 bg-[#FBDD23]"
                      : "w-1.5 bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
