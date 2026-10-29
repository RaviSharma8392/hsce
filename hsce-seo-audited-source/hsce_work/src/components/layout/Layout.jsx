import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ChevronDown,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Search,
  Phone,
  Mail,
} from "lucide-react";

import {
  collegeInfo as defaultCollegeInfo,
  navItems,
} from "../../data/siteData";
import { seoPages } from "../../data/seoPages";

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

const COLORS = {
  navy: "#194178",
  blue: "#343B91",
  yellow: "#FBDD23",
  text: "#25283A",
  muted: "#68728A",
  border: "#E6E9F0",
  background: "#F7F8FC",
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

  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const canonicalPath =
    CANONICAL_PATH_ALIASES[pathname] ||
    (pathname.startsWith("/notices/") ? "/notices" : pathname);
  const canonicalUrl = `https://hscekanjhawala.com${canonicalPath}`;
  const isSearchPage = pathname === "/search";
  const seoPage = seoPages.find((page) => page.path === canonicalPath);
  const isNotFoundPage = !seoPage;
  const closeTimerRef = useRef(null);

  const { language, setLanguage, isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const settings = usePublishedRecords("siteContent", [defaultCollegeInfo]);

  const collegeInfo =
    settings.find((record) => record.id === "settings") ||
    settings[0] ||
    defaultCollegeInfo;

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveNestedDropdown(null);
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

  const hindiName = "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन";
  const englishName = collegeInfo.name || "Haryana Shakti College of Education";

  const hindiAddress = collegeInfo.addressHindi || "Kanjhawala, Delhi – 110081";
  const displayedName = isHindi ? hindiName : englishName;

  const phoneText =
    collegeInfo.phone || collegeInfo.contactPhone || "+91-11-25951234";
  const phoneHref = `tel:${phoneText.replace(/[^+\d]/g, "")}`;
  const emailText =
    collegeInfo.email ||
    collegeInfo.contactEmail ||
    "info@haryanashaktibed.org";
  const adminPortalHref =
    import.meta.env.VITE_ADMIN_PORTAL_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5175/admin/signin"
      : "https://office.hscekanjhawala.com/admin/signin");
  const leftFloatingItems = [
    {
      name: "Phone",
      label: `Call: ${phoneText}`,
      href: phoneHref,
      Icon: Phone,
      className: "bg-[#0a4b8c] hover:bg-[#073665]",
      isExternal: false,
    },
    {
      name: "Email",
      label: `Email: ${emailText}`,
      href: `mailto:${emailText}`,
      Icon: Mail,
      className: "bg-[#EA4335] hover:bg-[#d93025]",
      isExternal: false,
    },
    {
      name: "Facebook",
      label: "Facebook",
      href: collegeInfo.facebook || "https://www.facebook.com",
      Icon: Facebook,
      className: "bg-[#1877F2] hover:bg-[#1464c9]",
      isExternal: true,
    },
    {
      name: "Instagram",
      label: "Instagram",
      href: collegeInfo.instagram || "https://www.instagram.com/hscekanjhawala/",
      Icon: Instagram,
      className: "bg-[#E1306C] hover:bg-[#c1275b]",
      isExternal: true,
    },
    {
      name: "LinkedIn",
      label: "LinkedIn",
      href: collegeInfo.linkedin || "https://www.linkedin.com",
      Icon: Linkedin,
      className: "bg-[#0077B5] hover:bg-[#005f93]",
      isExternal: true,
    },
  ];

  const getCleanAffiliation = () => {
    const raw =
      collegeInfo.affiliation ||
      "Guru Gobind Singh Indraprastha University (GGSIPU)";

    const stripped = raw.replace(/^Affiliated to\s+/i, "").trim();

    if (isHindi) {
      if (collegeInfo.affiliationHindi) {
        return collegeInfo.affiliationHindi
          .replace(/^Affiliated to\s+/i, "")
          .trim();
      }

      return `${stripped} से संबद्ध`;
    }

    return `Affiliated to ${stripped}`;
  };

  const displayedAffiliation = getCleanAffiliation();

  const displayedRecognition = isHindi
    ? collegeInfo.recognitionHindi || collegeInfo.recognition || ""
    : collegeInfo.recognition || "";

  const displayedAccreditation = isHindi
    ? collegeInfo.accreditationNoteHindi || collegeInfo.accreditationNote || ""
    : collegeInfo.accreditationNote || "";

  const isItemActive = (item) => {
    if (item.to === "/" && location.pathname === "/") {
      return true;
    }

    if (
      item.to &&
      item.to !== "/" &&
      (location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`))
    ) {
      return true;
    }

    return Boolean(
      item.subLinks?.some(
        (sub) =>
          (sub.to && location.pathname === sub.to) ||
          sub.subLinks?.some((nested) => location.pathname === nested.to),
      ),
    );
  };

  const renderDesktopNavItem = (item) => {
    const hasSub = Boolean(item.subLinks?.length);
    const isActive = isItemActive(item);
    const isOpen = activeDropdown === item.label;
    const label = getLabel(item, isHindi);

    const linkClass = `relative flex min-h-[48px] shrink-0 items-center gap-1.5 px-3 py-3 text-[13px] font-semibold tracking-normal transition-colors duration-200 xl:px-4 ${
      isActive || isOpen
        ? "bg-[#252E79] text-[#FBDD23]"
        : "text-white hover:bg-white/10 hover:text-[#FBDD23]"
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
            {label}
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <NavLink
            to={item.to}
            end={item.to === "/"}
            className={({ isActive: linkActive }) =>
              `${linkClass} ${
                linkActive || isActive ? "bg-[#252E79] text-[#FBDD23]" : ""
              }`
            }>
            {label}
          </NavLink>
        )}

        {/* DROPDOWN */}
        {hasSub && isOpen && (
          <div className="absolute left-0 top-full z-[80] min-w-[240px] overflow-visible rounded-b-md border border-[#E6E9F0] border-t-[3px] border-t-[#FBDD23] bg-white py-1.5 shadow-[0_12px_28px_rgba(25,45,90,0.16)]">
            {item.subLinks.map((sub) => {
              const hasNested = Boolean(sub.subLinks?.length);
              const nestedOpen = activeNestedDropdown === sub.label;

              const subActive =
                location.pathname === sub.to ||
                Boolean(
                  sub.subLinks?.some(
                    (nested) => location.pathname === nested.to,
                  ),
                );

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
                      aria-haspopup="true"
                      onClick={() =>
                        setActiveNestedDropdown((current) =>
                          current === sub.label ? null : sub.label,
                        )
                      }
                      className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-[13px] transition-colors ${
                        nestedOpen || subActive
                          ? "bg-[#F2F4FC] font-semibold text-[#194178]"
                          : "text-[#343747] hover:bg-[#F7F8FC] hover:text-[#194178]"
                      }`}>
                      {getLabel(sub, isHindi)}
                      <ChevronRight size={15} />
                    </button>
                  ) : (
                    <Link
                      to={sub.to}
                      className={`block px-4 py-3 text-[13px] transition-colors ${
                        subActive
                          ? "bg-[#F2F4FC] font-semibold text-[#194178]"
                          : "text-[#343747] hover:bg-[#F7F8FC] hover:text-[#194178]"
                      }`}>
                      {getLabel(sub, isHindi)}
                    </Link>
                  )}

                  {/* NESTED DROPDOWN */}
                  {hasNested && nestedOpen && (
                    <div className="absolute left-full top-0 z-[90] min-w-[225px] rounded-r-md border border-[#E6E9F0] border-t-[3px] border-t-[#FBDD23] bg-white py-1.5 shadow-xl">
                      {sub.subLinks.map((nested) => {
                        const nestedActive = location.pathname === nested.to;

                        return (
                          <Link
                            key={nested.label}
                            to={nested.to}
                            className={`block border-b border-gray-100 px-4 py-3 text-[13px] last:border-b-0 ${
                              nestedActive
                                ? "bg-[#F2F4FC] font-semibold text-[#194178]"
                                : "text-[#343747] hover:bg-[#F7F8FC] hover:text-[#194178]"
                            }`}>
                            {getLabel(nested, isHindi)}
                          </Link>
                        );
                      })}
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
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content={seoPage?.title || "Page Not Found | Haryana Shakti College of Education"}
        />
        <meta
          property="og:description"
          content={
            seoPage?.description ||
            "The requested page could not be found on the Haryana Shakti College of Education website."
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:site_name"
          content="Haryana Shakti College of Education"
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={seoPage?.title || "Page Not Found | Haryana Shakti College of Education"}
        />
        <meta
          name="twitter:description"
          content={
            seoPage?.description ||
            "The requested page could not be found on the Haryana Shakti College of Education website."
          }
        />
        {(isSearchPage || isNotFoundPage) && (
          <meta name="robots" content="noindex, follow" />
        )}
      </Helmet>
      <div
        className="flex min-h-screen flex-col font-sans antialiased"
        style={{
          backgroundColor: COLORS.background,
          color: COLORS.text,
          fontFamily:
            '"Inter", "Noto Sans Devanagari", "Mangal", "Segoe UI", sans-serif',
        }}>
      {/* ==========================================
          FLOATING LEFT SIDEBAR: CONTACT & SOCIAL
      =========================================== */}
      <div className="fixed left-0 top-1/2 z-[100] hidden -translate-y-1/2 flex-col shadow-2xl lg:flex rounded-r-lg overflow-hidden border-y border-r border-white/20">
        {leftFloatingItems.map(({ name, label, href, Icon, className, isExternal }) => (
          <a
            key={name}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`flex h-[44px] w-[44px] items-center justify-center ${className} text-white transition-all duration-200 hover:w-[50px] shadow-sm`}
            title={label}
            aria-label={label}>
            <Icon size={19} strokeWidth={2} />
          </a>
        ))}
      </div>

      {/* ==========================================
          FLOATING RIGHT ACTION BUTTONS
      =========================================== */}
      <div className="fixed right-0 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-1 shadow-xl lg:flex">
        <Link
          to="/campus-tour"
          className="flex items-center justify-center rounded-l-md bg-[#003366] px-2.5 py-6 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#002244]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Campus Tour
        </Link>
        <button
          onClick={openAdmissionModal}
          className="flex items-center justify-center rounded-l-md bg-[#B91C1C] px-2.5 py-6 text-[14px] font-bold tracking-wide text-white transition-colors hover:bg-[#991B1B]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          For Admission Apply Here
        </button>
      </div>

      {/* ==========================================
          DESKTOP HEADER
      =========================================== */}
      <div className="relative z-50 hidden lg:sticky lg:top-0 lg:block">
        {/* TOP UTILITY BAR */}
        <div
          className="border-b-[3px] border-b-[#FBDD23] text-white"
          style={{ backgroundColor: COLORS.navy }}>
          <div className="mx-auto flex min-h-[42px] max-w-[1400px] items-center justify-between px-5 xl:px-8">
            {/* LEFT: LANGUAGE & DIRECT CONTACT */}
            <div className="flex items-center gap-4 xl:gap-5">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`transition-colors hover:text-[#FBDD23] ${
                    language === "hi" ? "text-[#FBDD23]" : ""
                  }`}>
                  हिंदी
                </button>
                <span className="text-white/35">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`transition-colors hover:text-[#FBDD23] ${
                    language === "en" ? "text-[#FBDD23]" : ""
                  }`}>
                  English
                </button>
              </div>

              <span className="h-4 w-px bg-white/30" />

              <a
                href={phoneHref}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wide transition-colors hover:text-[#FBDD23]">
                <Phone size={13} className="shrink-0 text-[#FBDD23]" />
                <span>{phoneText}</span>
              </a>

              <span className="h-4 w-px bg-white/30" />

              <a
                href={`mailto:${emailText}`}
                className="flex items-center gap-1.5 text-[12px] font-semibold tracking-wide transition-colors hover:text-[#FBDD23]">
                <Mail size={13} className="shrink-0 text-[#FBDD23]" />
                <span>{emailText}</span>
              </a>
            </div>

            {/* RIGHT: INSTITUTIONAL LINKS, SEARCH & ADMIN */}
            <div className="flex shrink-0 items-center gap-4 text-[12px] font-bold tracking-[0.04em] xl:gap-5">
              <Link
                to="/iqac"
                className="hidden transition-colors hover:text-[#FBDD23] xl:inline">
                IQAC
              </Link>
              <span className="hidden h-4 w-px bg-white/30 xl:inline" />
              <Link
                to="/mandatory-disclosure"
                className="hidden transition-colors hover:text-[#FBDD23] 2xl:inline">
                MANDATORY DISCLOSURE
              </Link>
              <span className="hidden h-4 w-px bg-white/30 2xl:inline" />
              <Link
                to="/contact"
                className="transition-colors hover:text-[#FBDD23]">
                CONTACT US
              </Link>
              <span className="h-4 w-px bg-white/30" />
              <Link
                to="/search"
                className="flex items-center gap-1.5 transition-colors hover:text-[#FBDD23]"
                aria-label="Search">
                <Search size={15} />
                <span className="hidden xl:inline">SEARCH</span>
              </Link>
              {adminPortalHref && (
                <>
                  <span className="h-4 w-px bg-white/30" />
                  <a
                    href={adminPortalHref}
                    className="transition-colors hover:text-[#FBDD23]">
                    OFFICE LOGIN
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* BRANDING SECTION */}
        <header className="relative border-b border-[#E7EAF2] bg-white">
          <div className="mx-auto grid min-h-[126px] max-w-[1400px] grid-cols-[minmax(0,1.2fr)_minmax(340px,1.5fr)_minmax(0,1fr)] items-center gap-4 px-5 py-3 xl:px-8">
            <Link
              to="/"
              aria-label="College home"
              className="group flex shrink-0 items-center justify-start gap-4">
              <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full border border-[#E5D57B] bg-white p-1 shadow-sm transition-transform duration-200 group-hover:scale-[1.03] xl:h-[90px] xl:w-[90px]">
                <img
                  src={LOGO_SRC}
                  width="432"
                  height="432"
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="break-words font-serif text-[clamp(14px,1.1vw,18px)] font-bold leading-tight tracking-wide text-[#DC2626]">
                  {hindiName}
                </h2>
                <p className="mt-1 text-[11px] font-medium text-[#68728A] xl:text-[12px]">
                  {hindiAddress}
                </p>
              </div>
            </Link>

            <div className="flex min-w-0 flex-col items-center justify-center px-2 text-center">
              <span className="mb-2 h-[3px] w-12 rounded-full bg-[#FBDD23]" />
              <Link
                to="/"
                className="group flex max-w-full flex-col items-center text-center">
                <h1 className="break-words font-serif text-[clamp(18px,1.6vw,26px)] font-extrabold leading-tight tracking-normal text-[#194178] transition-colors group-hover:text-[#343B91]">
                  {englishName}
                </h1>

                <p className="mt-2 break-words text-[11px] font-semibold leading-snug text-[#303B58] xl:text-[12px]">
                  {displayedAffiliation}
                </p>
                {displayedRecognition && (
                  <p className="mt-0.5 break-words text-[10px] font-medium leading-snug text-[#68728A] xl:text-[11px]">
                    {displayedRecognition}
                  </p>
                )}
              </Link>
            </div>

            <div className="flex min-w-0 items-center justify-end">
              {UNIVERSITY_LOGO_SRC && (
                <img
                  src={UNIVERSITY_LOGO_SRC}
                  width="897"
                  height="278"
                  alt="University Logo"
                  className="h-20 object-contain xl:h-24"
                />
              )}
            </div>
          </div>
        </header>

        {/* MAIN NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="relative border-b-[3px] border-b-[#FBDD23] bg-[#343B91] shadow-sm">
          <div className="mx-auto flex max-w-[1400px] flex-wrap justify-center overflow-visible px-3 xl:px-5">
            {navItems.map(renderDesktopNavItem)}
          </div>
        </nav>
      </div>

      {/* ==========================================
          MOBILE HEADER (Matched to reference layout)
      =========================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E7EAF2] border-t-[4px] border-t-[#252E79] bg-[#F7F5FC] shadow-md lg:hidden">
        <div className="mx-auto flex items-center gap-3 px-3 py-3">
          {/* COLLEGE LOGO */}
          <Link
            to="/"
            aria-label="College home"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E5D57B] bg-white p-1 shadow-sm sm:h-14 sm:w-14">
            <img
              src={LOGO_SRC}
              width="432"
              height="432"
              alt="College logo"
              className="h-full w-full object-contain"
            />
          </Link>

          {/* COLLEGE NAME & AFFILIATION */}
          <Link
            to="/"
            className="flex min-w-0 flex-1 flex-col justify-center"
            aria-label="College home">
            <h1
              className="break-words font-serif text-[15px] font-bold leading-tight text-[#252E79] sm:text-[17px]"
              style={{
                fontFamily: '"Noto Sans Devanagari", "Mangal", sans-serif',
              }}>
              {displayedName}
            </h1>
            <p className="mt-1 break-words text-[10px] font-medium leading-tight text-[#4A5568] sm:text-[11px]">
              {displayedAffiliation}
            </p>
          </Link>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        phoneNumber={phoneText}
      />

      {/* PAGE CONTENT */}
      <main className="min-w-0 flex-1 bg-transparent pb-20 lg:pb-0">
        {children}
      </main>

      {/* FOOTER */}
      <Footer
        collegeInfo={collegeInfo}
        displayedName={displayedName}
        displayedAffiliation={displayedAffiliation}
        displayedRecognition={displayedRecognition}
        displayedAccreditation={displayedAccreditation}
      />

      {/* WEBSITE WATERMARK */}
      <WebsiteWatermark />

      {/* FLOATING ACTIONS */}
      <EnquireNowTab />
      <AdmissionModal />

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileBottomNav
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      </div>
    </>
  );
}
