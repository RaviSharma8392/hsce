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

  return (
    <section
      aria-label="Campus Hero Carousel"
      className="relative w-full bg-slate-100 sm:bg-[#2E3A8C] p-3 sm:p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {/* Banner carousel container (Rounded floating card on mobile matching reference image) */}
        <div className="relative h-[480px] sm:h-[520px] lg:h-[min(72svh,720px)] lg:min-h-[500px] w-full rounded-2xl sm:rounded-none overflow-hidden shadow-xl sm:shadow-none border border-slate-200/90 sm:border-0">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}>
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                aria-hidden={currentIndex !== index}
                className="relative h-full w-full shrink-0 overflow-hidden">
                {/* Visual gradient overlay for text readability */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/40 md:bg-gradient-to-r md:from-black/85 md:via-black/40 md:to-transparent"
                />

                {/* Banner title */}
                <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 z-20 px-6 sm:px-12 md:top-16 lg:top-24 lg:translate-y-0 lg:px-16">
                  {/* Mobile View: Badge + Title + Subtitle (Matching Reference Image 4) */}
                  <div className="max-w-xl md:hidden">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBDD23] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A2254] shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A2254]" />
                      {isHindi
                        ? "जीजीएसआईपीयू संबद्ध • एनसीटीई मान्यता"
                        : "GGSIPU AFFILIATED • NCTE APPROVED"}
                    </span>

                    <h2 className="mt-2 text-[26px] sm:text-[30px] font-extrabold leading-[1.18] text-white drop-shadow-xl tracking-tight">
                      {isHindi ? (
                        <>व्यावसायिक शिक्षक शिक्षा के लिए आपकी पसंद</>
                      ) : (
                        <>Your Choice for Professional Career</>
                      )}
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-slate-100 font-medium drop-shadow-md">
                      {isHindi
                        ? "एनसीटीई द्वारा अनुमोदित एवं गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) दिल्ली से संबद्ध।"
                        : "Approved by NCTE & Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi."}
                    </p>
                  </div>

                  {/* Desktop View: Full Standard Desktop Badge + Heading + Subtitle */}
                  <div className="hidden md:block max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBDD23] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#363991] shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#363991]" />
                      {isHindi
                        ? "जीजीएसआईपीयू से संबद्ध • एनसीटीई मान्यता"
                        : "GGSIPU Affiliated • NCTE Approved"}
                    </span>

                    <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-[1.25] text-white drop-shadow-lg tracking-tight">
                      {isHindi ? (
                        <>
                          व्यावसायिक शिक्षक शिक्षा के लिए{" "}
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

                    <p className="mt-2 text-sm text-slate-200 line-clamp-2 sm:line-clamp-none font-medium max-w-lg drop-shadow-sm leading-relaxed">
                      {isHindi
                        ? "एनसीटीई द्वारा अनुमोदित एवं गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) दिल्ली से संबद्ध।"
                        : "Approved by NCTE & Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi."}
                    </p>
                  </div>
                </div>

                <picture>
                  <source
                    media="(max-width: 639px)"
                    srcSet={slide.mobileImage || slide.desktopImage}
                  />
                  <img
                    src={slide.desktopImage}
                    alt={slide.alt || `College banner ${index + 1}`}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    draggable="false"
                    className="block h-full w-full select-none object-cover object-center"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile top slide indicators (Matching Reference Image) */}
        {totalSlides > 1 && (
          <div className="absolute inset-x-0 top-6 z-20 flex justify-center items-center gap-1.5 md:hidden">
            {slides.map((slide, index) => (
              <button
                key={
                  slide?.id
                    ? `banner-dot-${slide.id}-${index}`
                    : `banner-dot-${index}`
                }
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className="p-1 cursor-pointer">
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-6 bg-[#FBDD23]"
                      : "w-1.5 bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Desktop previous/next controls */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={text.prev}
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#2E3A8C]/80 text-white backdrop-blur-sm transition-colors hover:border-[#FBDD23] hover:bg-[#2E3A8C] hover:text-[#FBDD23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex lg:left-5 cursor-pointer">
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label={text.next}
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[#2E3A8C]/80 text-white backdrop-blur-sm transition-colors hover:border-[#FBDD23] hover:bg-[#2E3A8C] hover:text-[#FBDD23] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex lg:right-5 cursor-pointer">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Bottom actions bar */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-8 sm:pb-7 lg:px-12 lg:pb-10">
          <div className="mx-auto flex max-w-[1250px] flex-col items-stretch justify-between gap-3 md:flex-row md:items-center md:gap-4 lg:gap-6">
            {/* Campus tour: desktop/tablet */}
            <Link
              to="/book-a-tour"
              className="group hidden min-h-[48px] w-full items-center justify-between gap-4 rounded-full border border-white/75 bg-[#2E3A8C]/85 py-1 pl-5 pr-1 text-white shadow-md backdrop-blur-md transition-all hover:border-[#FBDD23] hover:bg-[#2E3A8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] md:flex md:w-auto md:min-w-[215px]">
              <span className="text-xs font-bold tracking-wider">
                {text.tour}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2E3A8C] transition-transform group-hover:translate-x-0.5 group-hover:bg-[#FBDD23]">
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
                <Search size={18} className="mr-3 shrink-0 text-[#2E3A8C]" />

                <input
                  type="text"
                  name="bannerSearch"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={text.placeholder}
                  aria-label="Search pages on this website"
                  className="w-full min-w-0 cursor-pointer bg-transparent py-1 text-sm font-medium text-[#1F2937] outline-none placeholder:text-gray-400 focus:cursor-text"
                />

                <button
                  type="submit"
                  aria-label="Go to search page"
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E3A8C] text-[#FBDD23] transition-colors group-hover:bg-[#202965] cursor-pointer">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Admission button: desktop/tablet */}
            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="group hidden min-h-[48px] w-full cursor-pointer items-center justify-between gap-4 rounded-full border-2 border-[#FBDD23] bg-[#FBDD23] hover:bg-[#FFDC13] py-1 pl-6 pr-1 text-[#2E3A8C] font-bold shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3A8C] md:flex md:w-auto md:min-w-[210px]">
              <span className="text-xs font-bold tracking-wider">
                {text.admission}
              </span>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E3A8C] text-[#FBDD23] transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={18} strokeWidth={2.5} />
              </span>
            </button>

            {/* Mobile: Dual CTA Buttons (Matching Reference Image 4) */}
            <div className="w-full grid grid-cols-2 gap-2.5 md:hidden">
              <button
                type="button"
                onClick={() => openAdmissionModal()}
                className="flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#FBDD23] hover:bg-[#FFDC13] px-3 py-2 text-xs font-bold text-[#1A2254] shadow-lg transition-all active:scale-95 cursor-pointer">
                <span>{isHindi ? "प्रवेश आवेदन" : "Apply for Admission"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>

              <Link
                to="/course"
                className="flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-slate-900/60 hover:bg-slate-900/80 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all active:scale-95 text-center">
                <span>{isHindi ? "बी.एड. विवरण" : "Explore B.Ed."}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop slide indicators */}
        {totalSlides > 1 && (
          <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:right-6 md:flex lg:right-20">
            {slides.map((slide, index) => (
              <button
                key={
                  slide?.id
                    ? `banner-line-${slide.id}-${index}`
                    : `banner-line-${index}`
                }
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className="group rounded-full p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] cursor-pointer">
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
      </div>
    </section>
  );
}
