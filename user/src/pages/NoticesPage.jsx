import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query as createQuery,
  where,
} from "firebase/firestore";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  Layers,
  ChevronDown,
} from "lucide-react";

import { db, firebaseReady } from "../config/firebase";
import { Container } from "../components/common/Container";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { PageNavigationLinks } from "../components/common/PageNavigationLinks";
import { useLanguage } from "../context/LanguageContext";
import AdobePdfIcon from "../components/common/AdobePdfIcon";
import AcademicTexturePattern from "../components/common/AcademicTexturePattern";

const PAGE_SIZE = 10;

const CATEGORY_ITEMS = [
  { key: "All", label: "All Notices", hiLabel: "सभी सूचनाएं" },
  { key: "Admissions", label: "Admissions & CET", hiLabel: "प्रवेश एवं सीईटी" },
  { key: "Examination", label: "Examinations & Viva", hiLabel: "परीक्षा एवं वाइवा" },
  { key: "Academic", label: "Academic & Internship", hiLabel: "शैक्षणिक एवं इंटर्नशिप" },
  { key: "Events", label: "Events & Workshops", hiLabel: "कार्यक्रम एवं कार्यशाला" },
  { key: "Scholarship", label: "Scholarships (State & NSP)", hiLabel: "छात्रवृत्ति (राज्य एवं राष्ट्रीय)" },
  { key: "Circular", label: "Official Circulars", hiLabel: "आधिकारिक परिपत्र" },
];

const CATEGORY_HI = {
  All: "सभी",
  Admissions: "प्रवेश",
  Admission: "प्रवेश",
  Examination: "परीक्षा",
  Academic: "शैक्षणिक",
  Events: "कार्यक्रम",
  Scholarship: "छात्रवृत्ति",
  Circular: "परिपत्र",
  Disclosure: "अनिवार्य प्रकटीकरण",
  "General Notice": "सामान्य",
};

function parseNoticeDate(rawDate) {
  if (!rawDate) return { day: "—", month: "HSCE", year: "2026" };

  let d = null;
  if (typeof rawDate?.toDate === "function") {
    d = rawDate.toDate();
  } else if (rawDate?.seconds) {
    d = new Date(rawDate.seconds * 1000);
  } else if (typeof rawDate === "string" || typeof rawDate === "number") {
    d = new Date(rawDate);
  }

  if (d && !Number.isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
    const year = String(d.getFullYear());
    return { day, month, year };
  }

  return { day: "—", month: "HSCE", year: "2026" };
}

/**
 * Notice Row (Displays Academic Date, Badge, Direct PDF Link, Department & Adobe PDF Icon)
 */
function NoticeRow({ notice, isHindi }) {
  const title = (isHindi && notice.hiTitle ? notice.hiTitle : notice.title) || "";
  const rawCategory = notice.category || notice.department || "General Notice";
  const categoryLabel =
    isHindi && notice.hiCategory
      ? notice.hiCategory
      : isHindi
        ? CATEGORY_HI[rawCategory] || rawCategory
        : rawCategory;

  const dateObj = parseNoticeDate(
    notice.publicationDate || notice.publishedAt || notice.createdAt
  );
  const pdfUrl =
    notice.pdfUrl ||
    notice.pdf ||
    notice.fileUrl ||
    notice.documentUrl ||
    notice.downloadUrl ||
    "";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-200 hover:border-[#363991] hover:shadow-md">
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4">
        {/* Left: Academic Date Badge */}
        <div className="flex w-16 sm:w-20 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-center shadow-2xs">
          <div className="w-full bg-[#363991] py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FBDD23] font-poppins">
            {dateObj.month}
          </div>
          <div className="py-1 sm:py-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-poppins leading-none">
              {dateObj.day}
            </span>
            <span className="block text-[9px] sm:text-[10px] text-slate-500 font-semibold font-poppins">
              {dateObj.year}
            </span>
          </div>
        </div>

        {/* Center: Notice Badges & Title */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {categoryLabel && (
              <span className="inline-flex items-center rounded-full bg-[#363991]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#363991]">
                {categoryLabel}
              </span>
            )}
            {notice.isPinned && (
              <span className="inline-flex items-center rounded bg-[#E6646E] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs animate-pulse">
                {isHindi ? "नया" : "NEW"}
              </span>
            )}
            {notice.referenceNumber && (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {notice.referenceNumber}
              </span>
            )}
            {notice.importantDate && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                <Calendar size={11} className="text-amber-700" />
                <span>{notice.importantDate}</span>
              </span>
            )}
          </div>

          {/* Title directly links to the PDF document */}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-poppins text-sm sm:text-base font-semibold text-slate-900 hover:text-[#363991] transition-colors leading-snug line-clamp-2 block"
            >
              {title}
            </a>
          ) : (
            <h3 className="font-poppins text-sm sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2">
              {title}
            </h3>
          )}

          {notice.department && (
            <p className="mt-1 text-xs text-slate-500 truncate font-sans">
              {notice.department}
            </p>
          )}
        </div>

        {/* Right: ONLY the Official Adobe PDF Icon (Direct Click to Open PDF) */}
        <div className="shrink-0 flex items-center justify-center pl-1 sm:pl-3">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={isHindi ? "Adobe PDF खोलें" : "Open Official Adobe PDF"}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl hover:bg-red-50 hover:scale-110 transition-all duration-200"
            >
              <AdobePdfIcon size={34} />
            </a>
          ) : (
            <div
              title={isHindi ? "दस्तावेज़ उपलब्ध नहीं है" : "Document unavailable"}
              className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl opacity-30"
            >
              <AdobePdfIcon size={30} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function NoticesPage() {
  const { isHindi } = useLanguage();

  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    if (!firebaseReady) {
      setNotices([]);
      setLoading(false);
      return undefined;
    }

    const q = createQuery(
      collection(db, "notices"),
      where("isPublished", "==", true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        const records = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter((item) => {
            const title = (item.title || item.hiTitle || "").trim();
            return title.length > 0 && item.isPublished !== false;
          });

        records.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;

          const getTime = (val) => {
            if (!val) return 0;
            if (typeof val?.toDate === "function") return val.toDate().getTime();
            if (val?.seconds) return val.seconds * 1000;
            const parsed = Date.parse(val);
            return Number.isNaN(parsed) ? 0 : parsed;
          };

          const timeA =
            getTime(a.publishedAt) ||
            getTime(a.publicationDate) ||
            getTime(a.createdAt);
          const timeB =
            getTime(b.publishedAt) ||
            getTime(b.publicationDate) ||
            getTime(b.createdAt);

          return timeB - timeA;
        });

        setNotices(records);
        setLoading(false);
      },
      (loadError) => {
        console.error("Notices listener error:", loadError);
        if (active) {
          setNotices([]);
          setError(
            isHindi
              ? "सर्वर से सूचनाएं लोड नहीं हो सकीं।"
              : "Unable to load notices from server. Please try again later."
          );
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [isHindi]);

  // Master notices list source - strictly real notices from Firestore
  const masterList = notices;

  // Search & Category Filtering
  const filteredNotices = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return masterList.filter((notice) => {
      if (category !== "All") {
        const itemCat = (notice.category || "").toLowerCase();
        const itemHiCat = (notice.hiCategory || "").toLowerCase();
        const selected = category.toLowerCase();

        const matchesCat =
          itemCat === selected ||
          itemHiCat === selected ||
          itemCat.includes(selected) ||
          selected.includes(itemCat);

        if (!matchesCat) return false;
      }

      if (!searchText) return true;

      return [
        notice.title,
        notice.hiTitle,
        notice.category,
        notice.hiCategory,
        notice.referenceNumber,
        notice.department,
      ].some((val) => val?.toLowerCase().includes(searchText));
    });
  }, [masterList, search, category]);

  // Dynamic Category counts across the dataset
  const categoryCounts = useMemo(() => {
    const counts = { All: masterList.length };
    for (const item of masterList) {
      const cat = item.category || "General Notice";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [masterList]);

  // Pagination across filtered notices
  const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE) || 1;
  const paginatedNotices = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredNotices.slice(start, start + PAGE_SIZE);
  }, [filteredNotices, page]);

  const changeCategory = (val) => {
    setCategory(val);
    setPage(0);
    setMobileMenuOpen(false);
  };

  const goToNextPage = () => {
    if (page < totalPages - 1 && !loading) {
      setPage((curr) => curr + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 0 && !loading) {
      setPage((curr) => curr - 1);
    }
  };

  const clearFilters = () => {
    setSearch("");
    changeCategory("All");
  };

  // Find active category label
  const activeCategoryObj =
    CATEGORY_ITEMS.find((c) => c.key === category) || {
      label: category,
      hiLabel: category,
    };

  return (
    <>
      <PageHeaderBanner
        title={isHindi ? "सूचनाएं एवं परिपत्र" : "Notices & Circulars"}
        subtitle={
          isHindi
            ? "आधिकारिक शैक्षणिक अधिसूचनाएं, परीक्षा कार्यक्रम एवं विश्वविद्यालय परिपत्र"
            : "Official circulars, admission notifications, examination schedules, and GGSIPU updates."
        }
        breadcrumbs={[{ label: isHindi ? "सूचनाएं" : "Notices" }]}
      />

      {/* Main Container with Institutional Watermark Texture */}
      <main className="relative min-h-screen bg-[#F4F6FA] py-8 sm:py-12 overflow-hidden">
        {/* Repeating Academic Line-Art Doodle Watermark Texture */}
        <AcademicTexturePattern opacity="opacity-[0.38]" />

        <Container className="relative z-10">
          {/* Mobile Category Toggle (Collapsible on smaller screens) */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between bg-[#363991] text-white px-4 py-3 rounded-xl font-poppins font-semibold text-sm shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#FBDD23]" />
                <span>
                  {isHindi ? "श्रेणी चुनें:" : "Select Category:"}{" "}
                  <strong className="text-[#FBDD23]">
                    {isHindi ? activeCategoryObj.hiLabel : activeCategoryObj.label}
                  </strong>
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg divide-y divide-slate-100 overflow-hidden">
                {CATEGORY_ITEMS.map((catItem) => {
                  const isActive = category === catItem.key;
                  const count =
                    catItem.key === "All"
                      ? masterList.length
                      : categoryCounts[catItem.key] || 0;
                  const label = isHindi ? catItem.hiLabel : catItem.label;

                  return (
                    <button
                      key={catItem.key}
                      type="button"
                      onClick={() => changeCategory(catItem.key)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between text-sm font-poppins transition ${
                        isActive
                          ? "bg-slate-50 text-[#363991] font-bold border-l-4 border-[#363991]"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <span>{label}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-[#363991] text-[#FBDD23]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* TWO-COLUMN LAYOUT: Categories on Left | PDF Notices on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: Categories Card (Styled exactly like user reference image) */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3.5 sticky top-24 self-start">
              <div className="overflow-hidden rounded-2xl bg-white shadow-md border border-slate-200/80 transition-shadow duration-200 hover:shadow-lg">
                {/* Solid Navy Header Bar matching user image */}
                <div className="bg-[#363991] px-5 py-4 text-white flex items-center justify-between">
                  <h2 className="font-poppins text-lg font-bold tracking-wide">
                    {isHindi ? "श्रेणियाँ" : "Categories"}
                  </h2>
                  <span className="text-xs bg-[#FBDD23] text-[#363991] font-bold px-2 py-0.5 rounded-full font-poppins">
                    {masterList.length} {isHindi ? "सूचनाएं" : "Notices"}
                  </span>
                </div>

                {/* Vertical Category Items List with thin dividers */}
                <nav className="divide-y divide-slate-100" aria-label="Notice Categories">
                  {CATEGORY_ITEMS.map((catItem) => {
                    const isActive = category === catItem.key;
                    const count =
                      catItem.key === "All"
                        ? masterList.length
                        : categoryCounts[catItem.key] || 0;
                    const label = isHindi ? catItem.hiLabel : catItem.label;

                    return (
                      <button
                        key={catItem.key}
                        type="button"
                        onClick={() => changeCategory(catItem.key)}
                        className={`group w-full px-5 py-3.5 text-left flex items-center justify-between font-poppins text-[15px] transition-all duration-150 ${
                          isActive
                            ? "bg-slate-50/90 text-[#363991] font-bold border-l-4 border-[#363991] pl-4"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#363991] font-medium"
                        }`}
                      >
                        <span className="truncate pr-2">{label}</span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold transition ${
                            isActive
                              ? "bg-[#363991] text-[#FBDD23] shadow-xs"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Institutional Helpline Tile */}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xs">
                <h3 className="font-poppins text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {isHindi ? "कॉलेज हेल्पलाइन" : "College Helpdesk"}
                </h3>
                <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#363991] shrink-0" />
                    <span className="font-semibold text-slate-800">
                      9953155054 / 8056777077
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#363991] shrink-0" />
                    <span className="text-slate-700 truncate">
                      hsce.kanjhawala@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: Search + Notices List with Adobe PDF Icons */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-8.5">
              {/* Search Bar & Result Summary */}
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#363991]"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      isHindi
                        ? "शीर्षक, संदर्भ संख्या या विभाग से सूचना खोजें..."
                        : "Search notices by title, circular number, or department..."
                    }
                    className="w-full rounded-xl border border-gray-200 bg-slate-50/70 py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/10 font-sans"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 font-poppins">
                      {isHindi ? activeCategoryObj.hiLabel : activeCategoryObj.label}:
                    </span>
                    <span className="rounded bg-yellow-100 px-2 py-0.5 font-bold text-[#363991]">
                      {filteredNotices.length}{" "}
                      {isHindi ? "उपलब्ध सूचनाएं" : "notices found"}
                    </span>
                  </div>

                  {(search || category !== "All") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 font-bold text-[#363991] hover:underline"
                    >
                      <RefreshCw size={12} />
                      <span>{isHindi ? "फ़िल्टर रीसेट करें" : "Reset Filters"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {error}
                </div>
              )}

              {/* List of Notices */}
              <section className="space-y-3">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-24 rounded-xl border border-slate-200 bg-white p-3.5 animate-pulse flex items-center gap-4 shadow-2xs"
                    >
                      <div className="h-full w-16 bg-slate-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                        <div className="h-3 w-1/3 bg-slate-100 rounded" />
                      </div>
                      <div className="h-12 w-12 bg-slate-100 rounded-xl shrink-0" />
                    </div>
                  ))
                ) : paginatedNotices.length > 0 ? (
                  paginatedNotices.map((notice) => (
                    <NoticeRow
                      key={notice.id || notice.slug}
                      notice={notice}
                      isHindi={isHindi}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/95 px-5 py-12 text-center shadow-xs">
                    <p className="text-sm font-semibold text-gray-700">
                      {isHindi
                        ? "चयनित श्रेणी में कोई सूचना नहीं मिली।"
                        : "No notices match your selected category or search criteria."}
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#363991] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#282A70] transition"
                    >
                      <RefreshCw size={12} />
                      <span>{isHindi ? "सभी सूचनाएं देखें" : "Show All Notices"}</span>
                    </button>
                  </div>
                )}
              </section>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={page === 0 || loading}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-[#363991] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>{isHindi ? "पिछला" : "Previous"}</span>
                  </button>

                  <span className="text-xs font-medium text-gray-500 font-poppins">
                    {isHindi
                      ? `पृष्ठ ${page + 1} / ${totalPages}`
                      : `Page ${page + 1} of ${totalPages}`}
                  </span>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={page >= totalPages - 1 || loading}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#363991] hover:underline disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>{isHindi ? "अगला" : "Next"}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PAGE NAVIGATION LINKS */}
          <div className="mt-12">
            <PageNavigationLinks
              previousPage={{
                title: "Photo Gallery",
                hiTitle: "छायाचित्र दीर्घा",
                to: "/gallery",
              }}
              nextPage={{
                title: "Mandatory Disclosures",
                hiTitle: "अनिवार्य प्रकटीकरण",
                to: "/mandatory-disclosure",
              }}
              relatedLinks={[
                {
                  title: "B.Ed. Admissions 2026-27",
                  hiTitle: "बी.एड. प्रवेश 2026-27",
                  description:
                    "Eligibility criteria, CET counselling steps, and document verification checklist.",
                  hiDescription:
                    "पात्रता मापदंड, काउंसलिंग चरण एवं दस्तावेज़ सत्यापन चेकलिस्ट।",
                  to: "/admissions",
                  iconKey: "admissions",
                },
                {
                  title: "B.Ed. Curriculum & Syllabus",
                  hiTitle: "बी.एड. पाठ्यक्रम एवं पाठ्यचर्या",
                  description:
                    "Four-semester syllabus framework, credits, and school internship schedule.",
                  hiDescription:
                    "चारों सेमेस्टर का पाठ्यक्रम, शिक्षण विषय एवं 16-सप्ताह की स्कूल इंटर्नशिप।",
                  to: "/course",
                  iconKey: "course",
                },
              ]}
            />
          </div>
        </Container>
      </main>
    </>
  );
}
