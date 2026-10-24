import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query as createQuery,
  startAfter,
  where,
} from "firebase/firestore";

import {
  Search,
  FileText,
  CalendarDays,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  BellRing,
  RefreshCw,
} from "lucide-react";

import { db, firebaseReady } from "../config/firebase";

import { Container } from "../components/common/Container";

import { PageHeaderBanner } from "../components/common/PageHeaderBanner";

import { PageNavigationLinks } from "../components/common/PageNavigationLinks";

import { notices as seedNotices } from "../data/siteData";
import { imageData } from "../data/imagesData";

import { displayDate } from "../hooks/usePublishedRecords";

import { useLanguage } from "../context/LanguageContext";

const PAGE_SIZE = 10;
const fallbackNotices = Array.isArray(seedNotices) ? seedNotices : [];

const CATEGORIES = [
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

const CATEGORY_HI = {
  "General Notice": "सामान्य सूचना",

  Admission: "प्रवेश",

  Examination: "परीक्षा",

  Results: "परिणाम",

  Academic: "शैक्षणिक",

  Scholarship: "छात्रवृत्ति",

  Recruitment: "भर्ती",

  Events: "कार्यक्रम",

  Holiday: "अवकाश",

  Circular: "परिपत्र",

  "Important Announcement": "महत्वपूर्ण घोषणा",
};

function PdfIcon({ compact = false }) {
  return (
    <img
      src={imageData.pdfIcon}
      alt="PDF"
      className={
        compact ? "h-7 w-7 object-contain" : "h-10 w-10 object-contain"
      }
    />
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1 w-7 rounded-full bg-[#FFD500]" />

        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#363991]">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function NoticeRow({ notice, isHindi }) {
  const title = isHindi && notice.hiTitle ? notice.hiTitle : notice.title;

  const description =
    isHindi && notice.hiDescription ? notice.hiDescription : notice.description;

  const categoryLabel =
    isHindi && notice.hiCategory
      ? notice.hiCategory
      : isHindi
        ? CATEGORY_HI[notice.category] || notice.category
        : notice.category;

  const date = displayDate(notice.publicationDate || notice.publishedAt);

  const pdfUrl = notice.pdfUrl && notice.pdfUrl !== "#" ? notice.pdfUrl : "";
  const NoticeLink = pdfUrl ? "a" : "div";

  return (
    <article className="group rounded-xl border border-gray-200 bg-white transition duration-200 hover:border-[#363991]/30 hover:shadow-md hover:shadow-[#363991]/[0.05]">
      <div className="flex items-start gap-3 p-4 sm:items-center sm:gap-4 sm:p-5">
        <NoticeLink
          {...(pdfUrl
            ? { href: pdfUrl, target: "_blank", rel: "noopener noreferrer" }
            : {})}
          aria-label={pdfUrl ? title : undefined}
          className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#363991]/[0.06] text-[#363991] transition-colors group-hover:bg-[#363991]/10">
            <PdfIcon compact />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {categoryLabel && (
                <span className="inline-flex max-w-full items-center rounded-md bg-[#363991]/[0.06] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#363991] sm:text-[11px]">
                  {categoryLabel}
                </span>
              )}

              {notice.isPinned && (
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase text-amber-800">
                  {isHindi ? "महत्वपूर्ण" : "Important"}
                </span>
              )}

              {date && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <CalendarDays size={13} />

                  {date}
                </span>
              )}
            </div>

            <h3 className="text-sm font-semibold leading-6 text-gray-900 transition-colors group-hover:text-[#363991] sm:text-base">
              {title || (isHindi ? "शीर्षक उपलब्ध नहीं है" : "Untitled notice")}
            </h3>

            {description && (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                {description}
              </p>
            )}

            {notice.referenceNumber && (
              <p className="mt-2 text-[11px] text-gray-400">
                {isHindi ? "संदर्भ संख्या:" : "Reference:"}{" "}
                {notice.referenceNumber}
              </p>
            )}
          </div>
        </NoticeLink>

        <div className="flex shrink-0 flex-col items-center gap-1 self-center sm:flex-row sm:gap-2">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download
              title={isHindi ? "पीडीएफ डाउनलोड करें" : "Download PDF"}
              aria-label={`${isHindi ? "पीडीएफ डाउनलोड करें" : "Download PDF"}: ${title}`}
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#363991]/20 hover:bg-[#363991]/[0.05] hover:text-[#363991] sm:flex">
              <Download size={17} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function NoticesPage() {
  const { isHindi } = useLanguage();

  const [notices, setNotices] = useState(fallbackNotices);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(0);

  const [cursors, setCursors] = useState([null]);

  const [lastDocument, setLastDocument] = useState(null);

  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    if (!firebaseReady) {
      setNotices(fallbackNotices);
      setHasMore(false);
      setLastDocument(null);
      setLoading(false);
      return undefined;
    }

    const constraints = [where("isPublished", "==", true)];
    if (category !== "All") {
      constraints.push(where("category", "==", category));
    }
    constraints.push(orderBy("publishedAt", "desc"));
    if (cursors[page]) {
      constraints.push(startAfter(cursors[page]));
    }
    constraints.push(limit(PAGE_SIZE + 1));

    const q = createQuery(collection(db, "notices"), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return;
        const pageDocuments = snapshot.docs.slice(0, PAGE_SIZE);
        setNotices(
          pageDocuments.map((item) => ({
            id: item.id,
            ...item.data(),
          })),
        );
        const nextCursor = pageDocuments.at(-1) || null;
        setLastDocument(nextCursor);
        setHasMore(snapshot.size > PAGE_SIZE);
        setLoading(false);
      },
      (loadError) => {
        console.error("Notices listener error:", loadError);
        if (active) {
          setNotices(fallbackNotices);
          setHasMore(false);
          setLastDocument(null);
          setError(
            isHindi
              ? "ऑनलाइन सूचनाएं लोड नहीं हो सकीं। उपलब्ध सूचनाएं दिखाई जा रही हैं।"
              : "Online notices could not be loaded. Available notices are shown instead.",
          );
          setLoading(false);
        }
      },
    );

    return () => {
      active = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [category, cursors, page, isHindi]);

  const filteredNotices = (Array.isArray(notices) ? notices : []).filter(
    (notice) => {
      const searchText = search.trim().toLowerCase();

      if (category !== "All") {
        const matchesCategory =
          notice.category?.toLowerCase() === category.toLowerCase() ||
          notice.hiCategory?.toLowerCase() === category.toLowerCase();

        if (!matchesCategory) return false;
      }

      if (!searchText) return true;

      return [
        notice.title,

        notice.hiTitle,

        notice.description,

        notice.hiDescription,

        notice.category,

        notice.hiCategory,

        notice.referenceNumber,
      ].some((value) => value?.toLowerCase().includes(searchText));
    },
  );

  const changeCategory = (value) => {
    setCategory(value);

    setPage(0);

    setCursors([null]);

    setLastDocument(null);

    setHasMore(false);
  };

  const goToNextPage = () => {
    if (!hasMore || !lastDocument || loading) return;

    setCursors((previous) => [...previous.slice(0, page + 1), lastDocument]);

    setPage((current) => current + 1);
  };

  const goToPreviousPage = () => {
    if (page === 0 || loading) return;

    setPage((current) => current - 1);
  };

  const clearFilters = () => {
    setSearch("");

    changeCategory("All");
  };

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "सूचनाएं एवं परिपत्र | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Notices and Announcements | Haryana Shakti College of Education"}
        </title>

        <meta
          name="description"
          content={
            isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन के आधिकारिक परिपत्र, प्रवेश एवं परीक्षा सूचनाएं।"
              : "Browse the latest notices, announcements and public updates from Haryana Shakti College of Education."
          }
        />
      </Helmet>

      <PageHeaderBanner
        title={isHindi ? "सूचनाएं एवं परिपत्र" : "Notices and Announcements"}
        subtitle={
          isHindi
            ? "आधिकारिक शैक्षणिक परिपत्र, प्रवेश, परीक्षा एवं प्रशासनिक विज्ञप्तियां"
            : "Official academic circulars, admissions, examination schedules and institutional updates."
        }
        breadcrumbs={[{ label: isHindi ? "सूचनाएं" : "Notices" }]}
      />

      <main className="min-h-screen bg-[#F7F8FC] py-8 sm:py-10 lg:py-14">
        <Container>
          {/* Page introduction */}

          <section className="mb-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-1 w-full bg-[#FFD500]" />

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#363991] text-white">
                  <BellRing size={23} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#363991]">
                    {isHindi ? "आधिकारिक अपडेट" : "OFFICIAL UPDATES"}
                  </p>

                  <h1 className="mt-1 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                    {isHindi ? "कॉलेज सूचना बोर्ड" : "College Notice Board"}
                  </h1>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {isHindi
                      ? "नवीनतम सूचनाएं खोजें और संबंधित दस्तावेज़ देखें।"
                      : "Find published notices and open the relevant documents."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                <FileText size={15} className="text-[#363991]" />

                {isHindi
                  ? "सूचनाएं एवं PDF दस्तावेज़"
                  : "Notices & PDF Documents"}
              </div>
            </div>
          </section>

          {/* Search and filters */}

          <section className="mb-7 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-[#363991]" />

              <h2 className="text-sm font-semibold text-gray-900">
                {isHindi ? "सूचनाएं खोजें" : "Find a Notice"}
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    isHindi
                      ? "शीर्षक, विषय या संदर्भ संख्या खोजें..."
                      : "Search by title, subject or reference number..."
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/[0.08]"
                />
              </div>

              <select
                value={category}
                onChange={(event) => changeCategory(event.target.value)}
                aria-label={isHindi ? "श्रेणी चुनें" : "Select category"}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-[#363991] focus:ring-4 focus:ring-[#363991]/[0.08]">
                <option value="All">
                  {isHindi ? "सभी श्रेणियां" : "All Categories"}
                </option>

                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {isHindi ? CATEGORY_HI[item] || item : item}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-[#363991]/30 hover:bg-gray-50 hover:text-[#363991]">
                <RefreshCw size={15} />

                {isHindi ? "रीसेट करें" : "Reset"}
              </button>
            </div>
          </section>

          {/* Notices list */}

          <section>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow={isHindi ? "सूचना केंद्र" : "NOTICE CENTRE"}
                title={isHindi ? "सभी सूचनाएं" : "Notices & Circulars"}
                subtitle={
                  isHindi
                    ? "किसी सूचना पर क्लिक करके उसका पूरा विवरण देखें। PDF आइकन से दस्तावेज़ खोलें।"
                    : "Select a notice to read its details, or use the red PDF icon to open its document."
                }
              />

              {!loading && (
                <p className="mb-6 shrink-0 text-xs font-medium text-gray-500">
                  {isHindi
                    ? `${filteredNotices.length} सूचनाएं दिखाई जा रही हैं`
                    : `${filteredNotices.length} notices shown`}
                </p>
              )}
            </div>

            {error && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex animate-pulse items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-100" />

                    <div className="flex-1">
                      <div className="mb-3 h-3 w-28 rounded bg-gray-100" />

                      <div className="h-4 max-w-md rounded bg-gray-100" />

                      <div className="mt-2 h-3 max-w-sm rounded bg-gray-100" />
                    </div>

                    <div className="h-10 w-9 rounded bg-red-50" />
                  </div>
                ))
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <NoticeRow
                    key={notice.id || notice.slug}
                    notice={notice}
                    isHindi={isHindi}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#363991]/[0.06] text-[#363991]">
                    <Search size={24} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-gray-900">
                    {isHindi ? "कोई सूचना नहीं मिली" : "No Notices Found"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    {isHindi
                      ? "आपकी खोज या चुनी गई श्रेणी से मेल खाने वाली सूचना उपलब्ध नहीं है। दूसरी खोज आज़माएं।"
                      : "No notices match your search or selected category. Try a different search or category."}
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#363991] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#292d78]">
                    {isHindi ? "सभी सूचनाएं देखें" : "Show All Notices"}
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}

            {!loading && (page > 0 || hasMore) && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={page === 0 || loading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[#363991]/30 hover:text-[#363991] disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft size={17} />

                  {isHindi ? "पिछला" : "Previous"}
                </button>

                <span className="text-xs font-medium text-gray-500 sm:text-sm">
                  {isHindi ? `पृष्ठ ${page + 1}` : `Page ${page + 1}`}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={!hasMore || loading}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#363991] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#292d78] disabled:cursor-not-allowed disabled:opacity-40">
                  {isHindi ? "अगला" : "Next"}

                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </section>

          {/* PDF help */}

          <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-3">
              <PdfIcon />

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {isHindi ? "PDF दस्तावेज़" : "PDF Documents"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {isHindi
                    ? "लाल PDF आइकन से उपलब्ध दस्तावेज़ खोलें।"
                    : "Use the red PDF icon to open an available document."}
                </p>
              </div>
            </div>

            <div className="sm:ml-auto">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#363991] transition hover:gap-3">
                {isHindi
                  ? "सहायता के लिए संपर्क करें"
                  : "Need help? Contact us"}

                <ExternalLink size={15} />
              </Link>
            </div>
          </section>

          {/* Page navigation */}

          <div className="mt-10 sm:mt-12">
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
                    "Eligibility criteria, counselling steps, and document checklist.",

                  hiDescription:
                    "पात्रता मापदंड, काउंसलिंग चरण एवं दस्तावेज़ सत्यापन चेकलिस्ट।",

                  to: "/admissions",

                  iconKey: "admissions",
                },

                {
                  title: "B.Ed. Curriculum & Syllabus",

                  hiTitle: "बी.एड. पाठ्यक्रम एवं पाठ्यचर्या",

                  description:
                    "Four semester syllabus, pedagogy subjects, and 16-week school internship.",

                  hiDescription:
                    "चारों सेमेस्टर का पाठ्यक्रम, शिक्षण विषय एवं 16-सप्ताह की स्कूल इंटर्नशिप।",

                  to: "/course/bed",

                  iconKey: "course",
                },

                {
                  title: "Institutional Committees",

                  hiTitle: "संस्थागत समितियाँ",

                  description:
                    "Academic Advisory, Grievance Redressal, and Anti-Ragging cells.",

                  hiDescription:
                    "शैक्षणिक सलाहकार, शिकायत निवारण एवं एंटी-रैगिंग प्रकोष्ठ।",

                  to: "/committees",

                  iconKey: "recognition",
                },

                {
                  title: "Contact Campus Office",

                  hiTitle: "कॉलेज कार्यालय संपर्क",

                  description:
                    "Helpline numbers, email assistance, and Kanjhawala campus map.",

                  hiDescription:
                    "हेल्पलाइन नंबर, ईमेल सहायता एवं कंझावला परिसर का पता।",

                  to: "/contact",

                  iconKey: "contact",
                },
              ]}
            />
          </div>
        </Container>
      </main>
    </>
  );
}
