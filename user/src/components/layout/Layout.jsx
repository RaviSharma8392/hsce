import { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Phone,
  Smartphone,
  Mail,
  MapPin,
  Home,
  GraduationCap,
  Compass,
  Menu,
} from "lucide-react";

import {
  collegeInfo as defaultCollegeInfo,
  navItems,
} from "../../data/siteData";
import { seoPages } from "../../data/seoPages";
import { createSeoStructuredData } from "../../data/seoStructuredData";

import { usePublishedRecords } from "../../hooks/usePublishedRecords";
import { useLanguage } from "../../context/LanguageContext";
import { imageData } from "../../data/imagesData";
import { EnquireNowTab } from "../common/EnquireNowTab";
import { AdmissionModal } from "../common/AdmissionModal";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import WebsiteWatermark from "../common/WebsiteWatermark";

const LOGO_SRC = imageData.collegeLogo;
const UNIVERSITY_LOGO_SRC = imageData.ggsipuLogo;

const SITE_NAME = "Haryana Shakti College of Education";
const SITE_URL = "https://hscekanjhawala.com";

const COLORS = {
  navy: "#363991",
  navyDark: "#282A70",
  gold: "#FBDD23",
  coral: "#E6646E",
  ink: "#1F2937",
  body: "#4B5563",
  muted: "#6B7280",
  line: "#E5E7EB",
  canvas: "#F4F6FA",
};

const CANONICAL_PATH_ALIASES = {
  "/about/campus-life": "/campus-life",
  "/about/overview": "/about",
  "/about/history-genesis": "/about/history",
  "/about/vision": "/about/vision-mission",
  "/about/mission": "/about/vision-mission",
  "/about/chairman-desk": "/about/chairman",
  "/about/chairman-message": "/about/chairman",
  "/about/principal-desk": "/about/principal",
  "/about/recognition-affiliation": "/about/recognition",
  "/about/affiliation": "/about/recognition",
  "/about/facilities": "/campus-life",
  "/about/campus": "/campus-life",
  "/about/campus-labs": "/campus-life",
  "/about/fact-sheet": "/about/facts",
  "/bed": "/course",
  "/curriculum": "/syllabus",
  "/calendar": "/course",
  "/faculty-staff": "/faculty",
  "/admission": "/admissions",
  "/admission/overview": "/admissions",
  "/admissions/overview": "/admissions",
  "/admission/eligibility": "/admissions/eligibility",
  "/admission/procedure": "/admissions/procedure",
  "/admission/documents": "/admissions/documents",
  "/admission-guide": "/admissions",
  "/course/bed": "/course",
  "/course/syllabus": "/syllabus",
  "/notice": "/notices",
  "/iqac": "/mandatory-disclosure",
  "/disclosure": "/mandatory-disclosure",
  "/disclosures": "/mandatory-disclosure",
  "/activities": "/gallery",
  "/events": "/gallery",
  "/photos": "/gallery",
  "/committees/overview": "/committees",
  "/committees/academic": "/committees",
  "/committees/grievance": "/committees",
  "/committees/anti-ragging": "/committees",
  "/tour": "/book-a-tour",
  "/campus-tour": "/book-a-tour",
  "/visit": "/book-a-tour",
  "/enquiry": "/contact/enquiry",
  "/enquiries": "/contact/enquiry",
  "/admission-enquiry": "/contact/enquiry",
  "/contact-us": "/contact",
  "/privacy-policy": "/privacy",
};

const getLabel = (item, isHindi) =>
  isHindi && item.hiLabel ? item.hiLabel : item.label;

export function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
  const [headerSearch, setHeaderSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const closeTimerRef = useRef(null);

  const { language, setLanguage, isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const settings = usePublishedRecords("siteContent", [defaultCollegeInfo]);

  const collegeInfo =
    settings.find((record) => record.id === "settings") ||
    settings[0] ||
    defaultCollegeInfo;

  const pathname = location.pathname.replace(/\/+$/, "") || "/";

  const canonicalPath =
    CANONICAL_PATH_ALIASES[pathname] ||
    (pathname.startsWith("/notices/") ? "/notices" : pathname);

  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const isSearchPage = pathname === "/search";
  const seoPage = seoPages.find((page) => page.path === canonicalPath);

  const pageTitle = seoPage?.title || SITE_NAME;

  const pageDescription =
    seoPage?.description ||
    "Haryana Shakti College of Education, Kanjhawala, Delhi offers the Bachelor of Education (B.Ed.) programme affiliated to Guru Gobind Singh Indraprastha University.";

  const shouldNoindex = isSearchPage || !seoPage;

  const structuredData = seoPage
    ? JSON.stringify(createSeoStructuredData(seoPage)).replace(/</g, "\\u003c")
    : null;

  const englishName = collegeInfo.name || SITE_NAME;

  const displayedName = isHindi
    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
    : englishName;

  const phoneText =
    collegeInfo.phone || collegeInfo.contactPhone || "+91-11-25951234";

  const alternatePhoneText = collegeInfo.alternatePhone || "8056777077";

  const phoneHref = `tel:${phoneText.replace(/[^\d+]/g, "")}`;
  const alternatePhoneHref = `tel:${alternatePhoneText.replace(/[^\d+]/g, "")}`;

  const formatPhone = (phone) =>
    phone.startsWith("+") ? phone : `+91 ${phone}`;

  const addressText = collegeInfo.address || "Kanjhawala, Delhi - 110081";

  const emailText =
    collegeInfo.email ||
    collegeInfo.contactEmail ||
    "info@haryanashaktibed.org";

  const adminPortalHref =
    import.meta.env.VITE_ADMIN_PORTAL_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5175/admin/signin"
      : "https://office.hscekanjhawala.com/admin/signin");

  const displayedAffiliation = (() => {
    const affiliation =
      collegeInfo.affiliation ||
      "Guru Gobind Singh Indraprastha University (GGSIPU)";

    const clean = affiliation.replace(/^Affiliated to\s+/i, "").trim();

    if (isHindi) {
      return collegeInfo.affiliationHindi
        ? collegeInfo.affiliationHindi.replace(/^Affiliated to\s+/i, "").trim()
        : `${clean} से संबद्ध`;
    }

    return `Affiliated to ${clean}`;
  })();

  const displayedRecognition = isHindi
    ? collegeInfo.recognitionHindi || collegeInfo.recognition || ""
    : collegeInfo.recognition || "";

  const handleHeaderSearch = (event) => {
    event.preventDefault();

    const query = headerSearch.trim();

    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");

    setHeaderSearch("");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 70);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prevPathnameRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      setMobileMenuOpen(false);
      setActiveDropdown(null);
      setActiveNestedDropdown(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (key) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveNestedDropdown(null);
    }, 180);
  };

  const isItemActive = (item) => {
    if (item.to === "/" && pathname === "/") {
      return true;
    }

    const itemBase = item.to ? item.to.split("?")[0] : "";
    if (
      itemBase &&
      itemBase !== "/" &&
      (pathname === itemBase || pathname.startsWith(`${itemBase}/`))
    ) {
      return true;
    }

    return Boolean(
      item.subLinks?.some(
        (sub) => {
          const subBase = sub.to ? sub.to.split("?")[0] : "";
          return (
            (subBase && pathname === subBase) ||
            sub.subLinks?.some((nested) => {
              const nestedBase = nested.to ? nested.to.split("?")[0] : "";
              return nestedBase && pathname === nestedBase;
            })
          );
        },
      ),
    );
  };

  const renderDesktopNavItem = (item) => {
    const hasSub = Boolean(item.subLinks?.length);
    const isActive = isItemActive(item);
    const isOpen = activeDropdown === item.label;
    const label = getLabel(item, isHindi);
    const isHome = item.isHome || item.label === "Home";

    const linkClass = `relative flex h-11 shrink-0 items-center gap-1.5 px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] xl:px-3.5 ${
      isActive || isOpen
        ? "text-[#FBDD23] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[3px] after:bg-[#FBDD23]"
        : "text-white hover:text-[#FBDD23]"
    }`;

    return (
      <div
        key={item.label}
        className="relative flex shrink-0"
        onMouseEnter={() => handleMouseEnter(item.label)}
        onMouseLeave={handleMouseLeave}>
        {hasSub ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() =>
              setActiveDropdown((current) =>
                current === item.label ? null : item.label,
              )
            }
            className={linkClass}>
            {isHome && <Home size={14} />}
            <span>{label}</span>

            {item.badge && (
              <span className="rounded bg-[#E6646E] px-1.5 py-0.5 text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}

            <ChevronDown size={13} className={isOpen ? "rotate-180" : ""} />
          </button>
        ) : (
          <NavLink
            to={item.to}
            end={item.to === "/"}
            className={({ isActive: linkActive }) =>
              `${linkClass} ${linkActive ? "text-[#FBDD23]" : ""}`
            }>
            {isHome && <Home size={14} />}
            <span>{label}</span>

            {item.badge && (
              <span className="rounded bg-[#E6646E] px-1.5 py-0.5 text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        )}

        {hasSub && (
          <div
            className={`absolute left-0 top-[calc(100%+8px)] z-[80] min-w-[250px] overflow-visible rounded-md border border-[#e6eaf0] bg-white py-2 shadow-[0_14px_35px_rgba(54,57,145,0.18)] ring-1 ring-black/5 transition duration-150 ${
              item.label === "Contact Us" ? "left-auto right-0" : ""
            } ${
              isOpen
                ? "visible opacity-100"
                : "invisible pointer-events-none opacity-0"
            }`}>
            {item.subLinks.map((sub) => {
              const hasNested = Boolean(sub.subLinks?.length);
              const nestedOpen = activeNestedDropdown === sub.label;

              const subActive =
                sub.to === (pathname + location.search) ||
                (pathname === sub.to && !location.search) ||
                Boolean(sub.subLinks?.some((nested) => pathname === nested.to));

              return (
                <div
                  key={sub.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) {
                      clearTimeout(closeTimerRef.current);
                      closeTimerRef.current = null;
                    }

                    setActiveNestedDropdown(hasNested ? sub.label : null);
                  }}>
                  {hasNested ? (
                    <button
                      type="button"
                      aria-expanded={nestedOpen}
                      onClick={() =>
                        setActiveNestedDropdown((current) =>
                          current === sub.label ? null : sub.label,
                        )
                      }
                      className={`flex w-full items-center justify-between gap-4 border-l-2 px-4 py-3 text-left text-[13px] transition-colors ${
                        nestedOpen || subActive
                          ? "border-[#FBDD23] bg-[#f6f8fc] font-semibold text-[#363991]"
                          : "border-transparent text-gray-700 hover:border-[#FBDD23] hover:bg-[#f8fafc]"
                      }`}>
                      {getLabel(sub, isHindi)}
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <Link
                      to={sub.to}
                      onClick={() => {
                        setActiveDropdown(null);
                        setActiveNestedDropdown(null);
                      }}
                      className={`block border-l-2 px-4 py-3 text-[13px] transition-colors ${
                        subActive
                          ? "border-[#FBDD23] bg-[#f6f8fc] font-semibold text-[#363991]"
                          : "border-transparent text-gray-700 hover:border-[#FBDD23] hover:bg-[#f8fafc]"
                      }`}>
                      {getLabel(sub, isHindi)}
                    </Link>
                  )}

                  {hasNested && (
                    <div
                      className={`absolute top-0 z-[90] min-w-[235px] rounded-md border border-[#e6eaf0] bg-white py-2 shadow-[0_14px_35px_rgba(54,57,145,0.18)] ring-1 ring-black/5 ${item.label === "Contact Us" ? "right-[calc(100%+6px)]" : "left-[calc(100%+6px)]"} ${
                        nestedOpen
                          ? "visible opacity-100"
                          : "invisible pointer-events-none opacity-0"
                      }`}>
                      {sub.subLinks.map((nested) => (
                        <Link
                          key={nested.label}
                          to={nested.to}
                          onClick={() => {
                            setActiveDropdown(null);
                            setActiveNestedDropdown(null);
                          }}
                          className={`block border-b border-gray-100 px-4 py-2.5 text-[12px] last:border-0 ${
                            pathname === nested.to
                              ? "bg-gray-100 font-semibold text-[#363991]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}>
                          {getLabel(nested, isHindi)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <html lang={isHindi ? "hi" : "en"} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="theme-color" content={COLORS.navy} />

        <meta property="og:locale" content={isHindi ? "hi_IN" : "en_IN"} />
        <meta
          property="og:locale:alternate"
          content={isHindi ? "en_IN" : "hi_IN"}
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={canonicalUrl} />

        {seoPage?.image && (
          <>
            <meta property="og:image" content={seoPage.image} />
            <meta property="og:image:alt" content={seoPage.imageAlt} />
            <meta name="twitter:image" content={seoPage.image} />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        <meta
          name="robots"
          content={
            shouldNoindex
              ? "noindex, follow"
              : "index, follow, max-image-preview:large"
          }
        />

        {structuredData && (
          <script type="application/ld+json">{structuredData}</script>
        )}
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[9999] focus:bg-[#FBDD23] focus:p-3 focus:text-[#363991]">
        Skip to main content
      </a>

      <style>{`
        /* Restrained heritage texture: very faint, with plenty of whitespace */
        .hsce-floral-paper {
          background-color: #fff;
          background-image:
            radial-gradient(ellipse 8px 13px at 50% 25%, rgba(54, 57, 145, .03) 0 40%, transparent 47%),
            radial-gradient(ellipse 8px 13px at 50% 75%, rgba(54, 57, 145, .03) 0 40%, transparent 47%),
            radial-gradient(ellipse 13px 8px at 25% 50%, rgba(54, 57, 145, .025) 0 40%, transparent 47%),
            radial-gradient(ellipse 13px 8px at 75% 50%, rgba(54, 57, 145, .025) 0 40%, transparent 47%);
          background-size: 118px 118px;
        }
        .hsce-floral-nav {
          background: #363991;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hsce-nav-link { transition: color .18s ease, background-color .18s ease; }
        }
      `}</style>
      <div
        className="flex min-h-screen flex-col antialiased"
        style={{
          backgroundColor: COLORS.canvas,
          color: COLORS.ink,
          fontFamily:
            '"Manrope", "Noto Sans Devanagari", sans-serif',
        }}>
        {/* Desktop header */}
        <div className="relative z-50 hidden lg:block">
          {/* Compact contact bar - HFCON Delhi Blue (#363991) */}
          <div className="border-b border-[#FBDD23]/70 bg-[#363991] text-white">
            <div className="mx-auto flex min-h-10 max-w-[1400px] items-center justify-between gap-5 px-6 lg:px-8 text-[11px]">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="shrink-0 text-[#FBDD23]" />
                  {addressText}
                </span>

                <a
                  href={phoneHref}
                  className="flex items-center gap-1.5 hover:text-[#FBDD23]">
                  <Phone size={13} className="text-[#FBDD23]" />
                  {formatPhone(phoneText)}
                </a>

                <a
                  href={alternatePhoneHref}
                  className="flex items-center gap-1.5 hover:text-[#FBDD23]">
                  <Smartphone size={13} className="text-[#FBDD23]" />
                  {formatPhone(alternatePhoneText)}
                </a>

                <a
                  href={`mailto:${emailText}`}
                  className="flex items-center gap-1.5 hover:text-[#FBDD23]">
                  <Mail size={13} className="text-[#FBDD23]" />
                  {emailText}
                </a>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <a href={adminPortalHref} className="hover:text-[#FBDD23]">
                  Staff Login
                </a>

                <span className="text-white/30">|</span>

                <Link
                  to="/mandatory-disclosure"
                  className="hover:text-[#FBDD23]">
                  IQAC
                </Link>

                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  className="ml-1 border border-white/40 px-2.5 py-1 hover:border-[#FBDD23] hover:text-[#FBDD23]"
                  aria-label="Switch language">
                  {language === "hi" ? "🇮🇳 हिंदी" : "🇺🇸 English"}
                  <ChevronDown size={11} className="ml-1 inline" />
                </button>
              </div>
            </div>
          </div>

          {/* Clean branding area */}
          <header className="hsce-floral-paper relative overflow-hidden border-b border-[#E8D9B4]">
            <div className="relative z-[1] mx-auto grid min-h-[112px] max-w-[1400px] grid-cols-[minmax(0,1.05fr)_minmax(190px,.62fr)_minmax(250px,.78fr)] items-center gap-5 px-6 py-3 xl:gap-7 lg:px-8">
              {/* College identity */}
              <Link to="/" className="flex min-w-0 items-center gap-4">
                <img
                  src={LOGO_SRC}
                  width="432"
                  height="432"
                  alt={`${englishName} logo`}
                  className="h-[74px] w-[74px] shrink-0 object-contain"
                />

                <div className="min-w-0">
                  <h1 className="max-w-[390px] text-[16px] font-bold leading-[1.25] text-[#363991] xl:text-[18px] 2xl:text-[19px]">
                    {englishName}
                  </h1>

                  <p className="mt-1.5 text-[12px] font-medium text-[#66758a]">
                    Kanjhawala, Delhi - 110081
                  </p>

                  <p className="mt-1.5 max-w-[390px] text-[11px] leading-[1.45] text-[#596779]">
                    {displayedAffiliation}
                  </p>
                </div>
              </Link>

              {/* Clearly visible university identity */}
              <div className="flex h-[76px] items-center justify-center border-x border-[#e7e8ef] px-5 xl:px-6">
                <img
                  src={UNIVERSITY_LOGO_SRC}
                  width="897"
                  height="278"
                  alt="Guru Gobind Singh Indraprastha University logo"
                  className="h-[64px] w-[205px] max-w-full shrink-0 object-contain"
                />
              </div>

              {/* Search and admissions */}
              <div className="flex min-w-0 flex-col items-end gap-3.5">
                <form
                  onSubmit={handleHeaderSearch}
                  role="search"
                  className="flex w-full max-w-[320px] items-center rounded-sm border border-[#cbd5e1] bg-white/90 shadow-[0_3px_12px_rgba(54,57,145,0.06)] transition focus-within:border-[#363991] focus-within:shadow-[0_0_0_3px_rgba(54,57,145,0.1)]">
                  <input
                    type="search"
                    value={headerSearch}
                    onChange={(event) => setHeaderSearch(event.target.value)}
                    placeholder="Search the website..."
                    aria-label="Search the website"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[12px] text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="px-3 py-2.5 text-[#363991] hover:text-[#282A70]">
                    <Search size={17} />
                  </button>
                </form>

                <button
                  type="button"
                  onClick={openAdmissionModal}
                  className="group relative flex min-h-[40px] items-center justify-center overflow-hidden rounded-md bg-[#FBDD23] px-6 py-2.5 text-[12px] font-bold tracking-[0.01em] text-[#363991] shadow-[0_4px_12px_rgba(251,221,35,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFDC13] hover:shadow-[0_7px_18px_rgba(251,221,35,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#363991] focus-visible:ring-offset-2">
                  <span className="absolute inset-x-3 top-0 h-px bg-white/70" />
                  Apply for Admission
                  <span
                    aria-hidden="true"
                    className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Desktop navigation remains sticky while scrolling */}
        <nav
          aria-label="Main navigation"
          className={`hsce-floral-nav sticky top-0 z-[60] hidden border-b-2 border-[#FBDD23] shadow-[0_4px_14px_rgba(54,57,145,0.12)] transition-all duration-200 lg:block ${isScrolled ? "py-0" : ""}`}>
          <div
            className={`mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-6 transition-all duration-200 lg:px-8 ${isScrolled ? "min-h-[44px]" : "min-h-[50px]"}`}>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-1">
              {navItems.map(renderDesktopNavItem)}
            </div>
          </div>
        </nav>

        {/* Mobile Header — Matching App Reference Header */}
        <header className="sticky top-0 z-40 border-t-2 border-[#363991] border-b border-[#E5E7EB] bg-white shadow-xs lg:hidden">
          <div className="flex min-h-[64px] items-center justify-between gap-2.5 px-3.5 py-2">
            {/* College Logo + Name + Affiliation Subtitle */}
            <Link
              to="/"
              aria-label="College home"
              className="flex min-w-0 flex-1 items-center gap-2.5">
              <img
                src={LOGO_SRC}
                width="432"
                height="432"
                alt={`${englishName} logo`}
                className="h-10 w-10 shrink-0 object-contain"
              />

              <div className="min-w-0">
                <h1 className="line-clamp-1 text-[13px] sm:text-[14px] font-bold leading-tight text-[#2E3A8C]">
                  {displayedName}
                </h1>
                <p className="line-clamp-1 text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight mt-0.5">
                  {isHindi
                    ? "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) संबद्ध"
                    : "Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU)"}
                </p>
              </div>
            </Link>

            {/* Mobile Header Actions: Search + Language + Menu Drawer Toggle */}
            <div className="flex shrink-0 items-center gap-1.5">
              <Link
                to="/search"
                aria-label="Search pages"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                <Search size={15} />
              </Link>

              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                aria-label="Switch language"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-[#363991] hover:bg-slate-50">
                {language === "hi" ? "EN" : "हिंदी"}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100 cursor-pointer">
                <Menu size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Floating desktop actions */}
        <div className="fixed right-0 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-1.5 lg:flex">
          <button
            type="button"
            onClick={openAdmissionModal}
            title="Apply Now"
            className="flex w-16 flex-col items-center gap-1 rounded-l-sm bg-[#FBDD23] px-2 py-3 text-[#363991] hover:bg-[#FFDC13]">
            <GraduationCap size={20} />
            <span className="text-[10px] font-bold leading-tight">
              Apply
              <br />
              Now
            </span>
          </button>

          <Link
            to="/book-a-tour"
            title="Campus Tour"
            className="flex w-16 flex-col items-center gap-1 rounded-l-sm bg-[#363991] px-2 py-3 text-white hover:bg-[#282A70]">
            <Compass size={19} />
            <span className="text-center text-[10px] font-medium leading-tight">
              Campus
              <br />
              Tour
            </span>
          </Link>
        </div>

        <MobileMenuDrawer
          isOpen={mobileMenuOpen}
          onClose={handleCloseMobileMenu}
          phoneNumber={phoneText}
        />

        <main
          id="main-content"
          className="min-w-0 flex-1 scroll-mt-28 pb-24 lg:pb-0">
          {children}
        </main>

        <Footer
          collegeInfo={collegeInfo}
          displayedName={displayedName}
          displayedAffiliation={displayedAffiliation}
          displayedRecognition={displayedRecognition}
        />

        <EnquireNowTab />
        <AdmissionModal />

        <MobileBottomNav
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <WebsiteWatermark />
      </div>
    </>
  );
}
