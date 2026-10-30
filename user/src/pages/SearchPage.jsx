import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  ExternalLink,
  X,
  Compass,
  FileText,
  UserCheck,
  BookOpen,
  Megaphone,
  GraduationCap,
  ArrowRight,
  Phone,
  Landmark,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { fetchPublishedRecords } from "../hooks/usePublishedRecords";
import { Container } from "../components/common/Container";
import { CollegiateWatermarkBg } from "../components/common/CollegiateWatermarkBg";
import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { searchData } from "../data/searchData";
import { defaultSyllabusItems } from "../services/syllabusService";
import { useLanguage } from "../context/LanguageContext";

/**
 * Normalizes text for lenient, intelligent search matching
 */
function normalizeSearchText(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .replace(/b\.ed\.?/gi, "bed b.ed")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Highlight matching query tokens in text for clean user feedback
 */
function HighlightMatch({ text, query }) {
  if (!text) return null;
  const rawQ = query?.trim();
  if (!rawQ) return <>{text}</>;

  const tokens = normalizeSearchText(rawQ)
    .split(" ")
    .filter((t) => t.length > 1);

  if (tokens.length === 0) return <>{text}</>;

  try {
    const escaped = tokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = String(text).split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-100 text-gray-950 font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

export default function SearchPage() {
  const { isHindi } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Accept common search query parameters (?q=, ?query=, ?search=, ?s=)
  const initialQuery =
    searchParams.get("q") ||
    searchParams.get("query") ||
    searchParams.get("search") ||
    searchParams.get("s") ||
    "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("all");

  // Keep searchInput synchronized if URL changes
  useEffect(() => {
    const currentParam =
      searchParams.get("q") ||
      searchParams.get("query") ||
      searchParams.get("search") ||
      searchParams.get("s") ||
      "";
    setSearchInput(currentParam);
  }, [searchParams]);

  // Debounce updating URL parameter to avoid re-render stutter while typing
  const debounceTimerRef = useRef(null);
  const handleInputChange = (value) => {
    setSearchInput(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (value.trim()) {
        nextParams.set("q", value.trim());
      } else {
        nextParams.delete("q");
        nextParams.delete("query");
        nextParams.delete("search");
        nextParams.delete("s");
      }
      setSearchParams(nextParams, { replace: true });
    }, 250);
  };

  const handleClear = () => {
    setSearchInput("");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    nextParams.delete("query");
    nextParams.delete("search");
    nextParams.delete("s");
    setSearchParams(nextParams, { replace: true });
  };

  const setQueryValue = (value) => {
    setSearchInput(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set("q", value.trim());
    else nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  // Published Firestore collections loaded once for the search session.
  const [liveNotices, setLiveNotices] = useState([]);
  const [liveFaculty, setLiveFaculty] = useState([]);
  const [liveSyllabus, setLiveSyllabus] = useState([]);
  useEffect(() => {
    let active = true;

    Promise.all([
      fetchPublishedRecords("notices", { limitCount: null }),
      fetchPublishedRecords("faculty", { limitCount: null }),
      fetchPublishedRecords("syllabus", { limitCount: null }),
    ]).then(([notices, faculty, syllabus]) => {
      if (!active) return;
      setLiveNotices(notices);
      setLiveFaculty(faculty);
      setLiveSyllabus(syllabus);
    });

    return () => {
      active = false;
    };
  }, []);

  // Combine site pages with records currently published in Firestore.
  const combinedCatalog = useMemo(() => {
    const catalog = [...searchData];
    const seenUrls = new Set(catalog.map((i) => i.url));

    // Live notices from Firestore
    liveNotices.forEach((notice) => {
      const fileUrl =
        (notice.pdfUrl && notice.pdfUrl !== "#" ? notice.pdfUrl : null) ||
        notice.fileUrl ||
        notice.officialUrl ||
        null;
      const targetUrl = fileUrl || "/notices";
      const uniqueKey = fileUrl || `notice_${notice.id || notice.slug}`;

      if (!seenUrls.has(uniqueKey)) {
        seenUrls.add(uniqueKey);
        catalog.push({
          name: notice.title || "College Notice",
          hiName: notice.titleHindi || notice.hiTitle || notice.title,
          category: "Notices & Circulars",
          hiCategory: "सूचनाएं एवं परिपत्र",
          url: targetUrl,
          isExternal: Boolean(fileUrl),
          description: notice.description || "Live notification from HSCE portal.",
          hiDescription: notice.hiDescription || "पोर्टल से लाइव प्रकाशित सूचना।",
          keywords: `${notice.title} ${notice.titleHindi || notice.hiTitle || ""} ${notice.category || ""} ${notice.department || ""} ${notice.referenceNumber || ""} notice circular exam datesheet`,
        });
      }
    });

    // C. Default syllabus items
    if (Array.isArray(defaultSyllabusItems)) {
      defaultSyllabusItems.forEach((syl) => {
        const fileUrl = (syl.pdfUrl && syl.pdfUrl !== "#" ? syl.pdfUrl : null) || syl.url || syl.fileUrl || null;
        const targetUrl = fileUrl || "/syllabus";

        if (!seenUrls.has(`syl_${syl.id}`)) {
          seenUrls.add(`syl_${syl.id}`);
          catalog.push({
            name: syl.title || `B.Ed. Syllabus (${syl.year})`,
            hiName: syl.hiTitle || `बी.एड. पाठ्यक्रम (${syl.year})`,
            category: "Academic Syllabus",
            hiCategory: "पाठ्यक्रम एवं विषय",
            url: targetUrl,
            isExternal: Boolean(fileUrl),
            description: syl.description || "Official Two-Year Combined B.Ed. Curriculum Framework.",
            hiDescription: syl.hiDescription || "दो वर्षीय नियमित बी.एड. पाठ्यक्रम का आधिकारिक दस्तावेज।",
            keywords: `${syl.title} ${syl.year || ""} ${syl.code || ""} syllabus curriculum paper subject pdf download`,
          });
        }
      });
    }

    // D. Live syllabus from Firestore
    liveSyllabus.forEach((syl) => {
      const fileUrl = (syl.pdfUrl && syl.pdfUrl !== "#" ? syl.pdfUrl : null) || syl.url || syl.fileUrl || null;
      const targetUrl = fileUrl || "/syllabus";
      const uniqueKey = `live_syl_${syl.id || syl.year}`;

      if (!seenUrls.has(uniqueKey)) {
        seenUrls.add(uniqueKey);
        catalog.push({
          name: `${syl.title || "B.Ed. Syllabus"} (${syl.year || "B.Ed. Programme"})`,
          hiName: `${syl.title || "बी.एड. पाठ्यक्रम"} (${syl.year || "बी.एड. पाठ्यक्रम"})`,
          category: "Academic Syllabus",
          hiCategory: "पाठ्यक्रम एवं विषय",
          url: targetUrl,
          isExternal: Boolean(fileUrl),
          description: syl.description || "Published academic syllabus document for B.Ed.",
          hiDescription: "बी.एड. हेतु प्रकाशित शैक्षणिक पाठ्यक्रम दस्तावेज।",
          keywords: `${syl.title} ${syl.year || ""} syllabus curriculum paper subject pdf download`,
        });
      }
    });

    // E. Live faculty records
    liveFaculty.forEach((faculty) => {
      catalog.push({
        name: `${faculty.name} — ${faculty.designation || "Faculty Member"}`,
        hiName: `${faculty.name} — ${faculty.designation || "संकाय सदस्य"}`,
        category: "Faculty & Staff",
        hiCategory: "संकाय एवं कर्मचारी",
        url: "/faculty",
        isExternal: false,
        description: `${faculty.designation || "Faculty Member"} (${faculty.department || faculty.subject || "Teacher Education"})`,
        hiDescription: `${faculty.designation || "संकाय सदस्य"} (${faculty.department || faculty.subject || "शिक्षक शिक्षा विभाग"})`,
        keywords: `${faculty.name} ${faculty.designation || ""} ${faculty.department || ""} ${faculty.subject || ""} ${faculty.qualification || ""} teacher professor lecturer staff educator`,
      });
    });

    return catalog;
  }, [liveNotices, liveFaculty, liveSyllabus]);

  // Token-based matching algorithm
  const filteredResults = useMemo(() => {
    const rawQuery = searchInput.trim().toLowerCase();
    if (!rawQuery) return [];

    const normalizedQuery = normalizeSearchText(rawQuery);
    const tokens = normalizedQuery.split(" ").filter((t) => t.length > 0);

    let results = combinedCatalog.filter((item) => {
      const searchBlob = normalizeSearchText(
        [
          item.name,
          item.hiName,
          item.category,
          item.hiCategory,
          item.url,
          item.keywords,
          item.description,
          item.hiDescription,
        ]
          .filter(Boolean)
          .join(" ")
      );

      // Check 1: Every query token is present in the searchable blob
      const allTokensMatch =
        tokens.length > 0 && tokens.every((token) => searchBlob.includes(token));

      // Check 2: Direct raw substring match for Hindi or exact phrase
      const rawMatch = [
        item.name,
        item.hiName,
        item.keywords,
        item.category,
        item.hiCategory,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(rawQuery);

      return allTokensMatch || rawMatch;
    });

    // Category filter
    if (activeCategory !== "all") {
      results = results.filter((item) => {
        if (activeCategory === "Notices & Circulars") {
          return /notice|circular|announcement/i.test(item.category || "");
        }
        if (activeCategory === "Admissions") {
          return /admission/i.test(item.category || "");
        }
        if (activeCategory === "Academic Syllabus") {
          return /syllabus|curriculum|course|academic/i.test(item.category || "");
        }
        if (activeCategory === "Faculty & Staff") {
          return /faculty|staff|teacher/i.test(item.category || "");
        }
        if (activeCategory === "About College") {
          return /about/i.test(item.category || "");
        }
        if (activeCategory === "Campus Life") {
          return /campus|facility|tour|gallery/i.test(item.category || "");
        }
        if (activeCategory === "Contact") {
          return /contact|enquiry/i.test(item.category || "");
        }
        return item.category === activeCategory;
      });
    }

    return results;
  }, [combinedCatalog, searchInput, activeCategory]);

  // Result counts per category
  const categoryCounts = useMemo(() => {
    const rawQuery = searchInput.trim().toLowerCase();
    if (!rawQuery) return {};

    const normalizedQuery = normalizeSearchText(rawQuery);
    const tokens = normalizedQuery.split(" ").filter((t) => t.length > 0);

    const baseMatches = combinedCatalog.filter((item) => {
      const searchBlob = normalizeSearchText(
        [
          item.name,
          item.hiName,
          item.category,
          item.hiCategory,
          item.url,
          item.keywords,
          item.description,
          item.hiDescription,
        ]
          .filter(Boolean)
          .join(" ")
      );
      const allTokensMatch =
        tokens.length > 0 && tokens.every((token) => searchBlob.includes(token));
      const rawMatch = [
        item.name,
        item.hiName,
        item.keywords,
        item.category,
        item.hiCategory,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(rawQuery);
      return allTokensMatch || rawMatch;
    });

    const counts = { all: baseMatches.length };
    baseMatches.forEach((item) => {
      let key = "other";
      if (/notice|circular/i.test(item.category || "")) key = "Notices & Circulars";
      else if (/admission/i.test(item.category || "")) key = "Admissions";
      else if (/syllabus|curriculum/i.test(item.category || "")) key = "Academic Syllabus";
      else if (/faculty|staff/i.test(item.category || "")) key = "Faculty & Staff";
      else if (/about/i.test(item.category || "")) key = "About College";
      else if (/campus|tour|gallery/i.test(item.category || "")) key = "Campus Life";
      else if (/contact/i.test(item.category || "")) key = "Contact";

      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [combinedCatalog, searchInput]);

  const categories = [
    { key: "all", label: isHindi ? "सभी परिणाम" : "All Results" },
    { key: "Admissions", label: isHindi ? "प्रवेश" : "Admissions" },
    { key: "Academic Syllabus", label: isHindi ? "पाठ्यक्रम" : "Syllabus" },
    { key: "Faculty & Staff", label: isHindi ? "संकाय" : "Faculty" },
    { key: "Notices & Circulars", label: isHindi ? "सूचनाएं" : "Notices" },
    { key: "About College", label: isHindi ? "कॉलेज परिचय" : "About HSCE" },
    { key: "Campus Life", label: isHindi ? "कैंपस" : "Campus" },
    { key: "Contact", label: isHindi ? "संपर्क" : "Contact" },
  ];

  const quickSuggestions = isHindi
    ? [
        { label: "बी.एड. प्रवेश 2026-27", query: "बी.एड. प्रवेश" },
        { label: "पाठ्यक्रम पीडीएफ", query: "पाठ्यक्रम पीडीएफ" },
        { label: "प्राचार्या संदेश", query: "प्राचार्या संदेश" },
        { label: "संकाय एवं शिक्षक", query: "संकाय" },
        { label: "परीक्षा सूचनाएं", query: "परीक्षा" },
        { label: "कैंपस भ्रमण", query: "कैंपस भ्रमण" },
        { label: "संपर्क व पता", query: "संपर्क" },
      ]
    : [
        { label: "B.Ed. Admission 2026-27", query: "B.Ed. Admission" },
        { label: "Syllabus PDF", query: "Syllabus PDF" },
        { label: "Principal's Desk", query: "Principal" },
        { label: "Faculty Directory", query: "Faculty" },
        { label: "Datesheets & Notices", query: "Notices" },
        { label: "Campus Tour", query: "Tour" },
        { label: "Contact Us", query: "Contact" },
      ];

  return (
    <>
      {/* Universal Website Page Header Banner (Matching other pages) */}
      <PageHeaderBanner
        title={isHindi ? "कॉलेज खोज केंद्र" : "Search HSCE Portal"}
        subtitle={
          isHindi
            ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन की आधिकारिक सूचनाएं, प्रवेश, पाठ्यक्रम, संकाय एवं सार्वजनिक पेज खोजें।"
            : "Search live circulars, B.Ed. admissions, syllabus documents, faculty directory, and college pages."
        }
        breadcrumbs={[{ label: isHindi ? "खोज" : "Search" }]}
      />

      {/* Main Content Area in Standard Website Colors */}
      <CollegiateWatermarkBg className="py-8 sm:py-12">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Search Input Box Card */}
            <div className="rounded-2xl border border-gray-300 bg-white p-3 shadow-xs transition-all focus-within:border-[#1c3274] focus-within:ring-2 focus-within:ring-[#1c3274]/15">
              <form
                role="search"
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[#1c3274]">
                  <Search size={20} />
                </div>

                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={
                    isHindi
                      ? "यहाँ खोजें (उदा. प्रवेश, बी.एड., पाठ्यक्रम, डॉ. सविता राठी, सूचनाएं)..."
                      : "Search notices, B.Ed. admission, syllabus, faculty, contact..."
                  }
                  aria-label="Search HSCE Portal"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  autoFocus
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search query"
                    title={isHindi ? "खोज साफ करें" : "Clear search"}
                    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 cursor-pointer">
                    <X size={16} />
                  </button>
                )}
              </form>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                {isHindi ? "सुझाव:" : "Suggestions:"}
              </span>
              {quickSuggestions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setQueryValue(item.query)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition hover:border-[#1c3274] hover:text-[#1c3274] hover:bg-gray-50 cursor-pointer">
                  {item.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills (When search query is active) */}
            {searchInput.trim() && (
              <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => {
                  const count = categoryCounts[cat.key] || 0;
                  const isActive = activeCategory === cat.key;

                  if (cat.key !== "all" && count === 0) return null;

                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveCategory(cat.key)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#1c3274] text-white shadow-xs"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}>
                      <span>{cat.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Results Section */}
            <section className="mt-6" aria-live="polite">
              {!searchInput.trim() ? (
                /* Zero Query State: Clean Standard Section Links */
                <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      {isHindi
                        ? "प्रमुख कॉलेज विभाग एवं पोर्टल पृष्ठ"
                        : "Browse Major College Portals"}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {isHindi
                        ? "सीधे संबंधित पृष्ठ पर जाने के लिए नीचे दिए गए विकल्पों में से चुनें:"
                        : "Select any category below to navigate directly to the verified page:"}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: isHindi ? "बी.एड. 2-वर्षीय डिग्री" : "B.Ed. Regular Degree",
                        desc: isHindi
                          ? "पात्रता, 100 सीटें एवं 4 सेमेस्टर पाठ्यक्रम"
                          : "Curriculum structure & semester details",
                        url: "/course/bed",
                        icon: GraduationCap,
                      },
                      {
                        title: isHindi ? "सत्र-वार पाठ्यक्रम PDF" : "Syllabus Documents",
                        desc: isHindi
                          ? "2026-27 एवं पिछले सत्रों के पाठ्यक्रम डाउनलोड"
                          : "Official year-wise syllabus PDF downloads",
                        url: "/syllabus",
                        icon: FileText,
                      },
                      {
                        title: isHindi ? "संकाय एवं प्राध्यापक" : "Faculty Directory",
                        desc: isHindi
                          ? "कॉलेज शिक्षकों एवं कर्मचारियों की योग्यता व पद"
                          : "Professors, lecturers, and staff directory",
                        url: "/faculty",
                        icon: UserCheck,
                      },
                      {
                        title: isHindi ? "सूचनाएं एवं परिपत्र" : "Circulars & Notices",
                        desc: isHindi
                          ? "परीक्षा फॉर्म, डेटशीट एवं कॉलेज घोषणाएं"
                          : "Exam forms, datesheets, and announcements",
                        url: "/notices",
                        icon: Megaphone,
                      },
                      {
                        title: isHindi ? "प्राचार्या संदेश" : "Principal's Desk",
                        desc: isHindi
                          ? "डॉ. सविता राठी का संदेश व दृष्टिकोण"
                          : "Dr. Savita Rathee's message and vision",
                        url: "/about/principal",
                        icon: Landmark,
                      },
                      {
                        title: isHindi ? "हेल्पलाइन एवं संपर्क" : "Contact & Helpline",
                        desc: isHindi
                          ? "कंझावला दिल्ली परिसर का पता व फोन"
                          : "Kanjhawala Delhi address & helpline",
                        url: "/contact",
                        icon: Phone,
                      },
                    ].map((hub) => {
                      const HubIcon = hub.icon;
                      return (
                        <Link
                          key={hub.title}
                          to={hub.url}
                          className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-[#1c3274] hover:shadow-xs">
                          <div>
                            <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[#1c3274]">
                              <HubIcon size={18} />
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1c3274] transition-colors">
                              {hub.title}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                              {hub.desc}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-[#1c3274]">
                            <span>{isHindi ? "देखें" : "View"}</span>
                            <ArrowRight
                              size={13}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Results List in Clean White Cards */
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1 text-xs text-gray-500">
                    <span>
                      {isHindi
                        ? `“${searchInput}” के लिए ${filteredResults.length} परिणाम मिले`
                        : `Showing ${filteredResults.length} result${
                            filteredResults.length > 1 ? "s" : ""
                          } for “${searchInput}”`}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700">
                      ✓ {isHindi ? "लाइव सिंक" : "Live Synced"}
                    </span>
                  </div>

                  <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
                    {filteredResults.map((result, idx) => {
                      const isExternal =
                        Boolean(result.isExternal) ||
                        result.url?.startsWith("http://") ||
                        result.url?.startsWith("https://");

                      const isNotice = result.category?.includes("Notice");
                      const isFaculty = result.category?.includes("Faculty");
                      const isSyllabus = result.category?.includes("Syllabus");
                      const isAdmission = result.category?.includes("Admission");
                      const isCampus = result.category?.includes("Campus");
                      const isContact = result.category?.includes("Contact");

                      const CardIcon = isNotice
                        ? Megaphone
                        : isFaculty
                        ? UserCheck
                        : isSyllabus
                        ? FileText
                        : isAdmission
                        ? GraduationCap
                        : isCampus
                        ? Compass
                        : isContact
                        ? Phone
                        : BookOpen;

                      const itemTitle =
                        isHindi && result.hiName ? result.hiName : result.name;
                      const itemCategory =
                        isHindi && result.hiCategory
                          ? result.hiCategory
                          : result.category;
                      const itemDescription =
                        isHindi && result.hiDescription
                          ? result.hiDescription
                          : result.description;

                      const cardContent = (
                        <div className="flex items-center justify-between gap-4 p-4 transition hover:bg-blue-50/30">
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Standard Icon Badge */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#1c3274] mt-0.5">
                              <CardIcon size={18} />
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                  {itemCategory}
                                </span>
                                {isExternal && (
                                  <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                                    PDF Document
                                  </span>
                                )}
                              </div>

                              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#1c3274] transition-colors leading-snug">
                                <HighlightMatch
                                  text={itemTitle}
                                  query={searchInput}
                                />
                              </h3>

                              {itemDescription && (
                                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                  <HighlightMatch
                                    text={itemDescription}
                                    query={searchInput}
                                  />
                                </p>
                              )}

                              <p className="mt-1 text-[11px] font-mono text-gray-400">
                                {isExternal ? "↗ Open document (new tab)" : result.url}
                              </p>
                            </div>
                          </div>

                          {/* Right Arrow Navigation Indicator */}
                          <div className="shrink-0 text-gray-400 group-hover:text-[#1c3274] transition-colors">
                            {isExternal ? (
                              <ExternalLink size={16} />
                            ) : (
                              <ArrowRight size={17} />
                            )}
                          </div>
                        </div>
                      );

                      return (
                        <li key={`${result.url}-${idx}`} className="group">
                          {isExternal ? (
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                              aria-label={`Open ${result.name} in a new tab`}>
                              {cardContent}
                            </a>
                          ) : (
                            <Link
                              to={result.url}
                              className="block"
                              aria-label={`Go to ${result.name}`}>
                              {cardContent}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                /* Clean Empty State */
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xs">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <HelpCircle size={24} />
                  </div>

                  <h3 className="mt-3 text-base font-bold text-gray-900">
                    {isHindi
                      ? `“${searchInput}” के लिए कोई परिणाम नहीं मिला`
                      : `No results found for “${searchInput}”`}
                  </h3>

                  <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-gray-500">
                    {isHindi
                      ? "कृपया वर्तनी की जांच करें या सामान्य शब्दों (जैसे 'प्रवेश', 'बी.एड.', 'पाठ्यक्रम' या 'परीक्षा') का प्रयोग करें।"
                      : "Check your spelling or try searching broader keywords like 'admission', 'bed', 'syllabus', or 'notices'."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="rounded-lg bg-[#1c3274] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#152554] cursor-pointer">
                      {isHindi ? "खोज रीसेट करें" : "Reset Search"}
                    </button>
                    <Link
                      to="/course/bed"
                      className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                      {isHindi ? "बी.एड. कोर्स" : "B.Ed. Course"}
                    </Link>
                    <Link
                      to="/admissions"
                      className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                      {isHindi ? "प्रवेश 2026-27" : "Admissions"}
                    </Link>
                    <Link
                      to="/syllabus"
                      className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                      {isHindi ? "पाठ्यक्रम" : "Syllabus"}
                    </Link>
                    <Link
                      to="/contact"
                      className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition">
                      {isHindi ? "संपर्क" : "Contact"}
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </Container>
      </CollegiateWatermarkBg>
    </>
  );
}
