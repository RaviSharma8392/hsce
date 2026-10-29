import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
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
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";
import { searchData } from "../data/searchData";
import { useLanguage } from "../context/LanguageContext";

export default function SearchPage() {
  const { isHindi } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // Live Firestore collections state
  const [liveNotices, setLiveNotices] = useState([]);
  const [liveFaculty, setLiveFaculty] = useState([]);
  const [liveSyllabus, setLiveSyllabus] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  // 1. Subscribe to live published notices
  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsub = onSnapshot(
      collection(db, "notices"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLiveNotices(list.filter((item) => item.isPublished !== false));
      },
      (err) => console.warn("Live notices search sync warning:", err)
    );
    return () => unsub();
  }, []);

  // 2. Subscribe to live faculty records
  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsub = onSnapshot(
      collection(db, "faculty"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLiveFaculty(list.filter((item) => item.isPublished !== false));
      },
      (err) => console.warn("Live faculty search sync warning:", err)
    );
    return () => unsub();
  }, []);

  // 3. Subscribe to live syllabus records
  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsub = onSnapshot(
      collection(db, "syllabus"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLiveSyllabus(list.filter((item) => item.isPublished !== false));
      },
      (err) => console.warn("Live syllabus search sync warning:", err)
    );
    return () => unsub();
  }, []);

  const updateQuery = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("q", value);
    else nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  // Combine static pages with live synchronized records
  const combinedCatalog = useMemo(() => {
    const catalog = [...searchData];

    // Merge live notices
    liveNotices.forEach((notice) => {
      catalog.push({
        name: notice.title || "College Notice",
        hiName: notice.titleHindi || notice.title,
        category: "Notices & Circulars",
        hiCategory: "सूचनाएं एवं परिपत्र",
        url: notice.fileUrl || "/notices",
        isExternal: Boolean(notice.fileUrl),
        keywords: `${notice.title} ${notice.titleHindi || ""} ${notice.category || ""} ${notice.description || ""} notice circular exam datesheet`,
      });
    });

    // Merge live faculty
    liveFaculty.forEach((faculty) => {
      catalog.push({
        name: `${faculty.name} — ${faculty.designation || "Faculty Member"}`,
        hiName: `${faculty.name} — ${faculty.designation || "संकाय सदस्य"}`,
        category: "Faculty & Staff",
        hiCategory: "संकाय एवं कर्मचारी",
        url: "/faculty",
        keywords: `${faculty.name} ${faculty.designation || ""} ${faculty.department || ""} ${faculty.qualification || ""} teacher professor lecturer staff`,
      });
    });

    // Merge live syllabus
    liveSyllabus.forEach((syl) => {
      catalog.push({
        name: `${syl.title} (${syl.year || "B.Ed. Programme"})`,
        hiName: `${syl.title} (${syl.year || "बी.एड. पाठ्यक्रम"})`,
        category: "Academic Syllabus",
        hiCategory: "पाठ्यक्रम एवं विषय",
        url: syl.fileUrl || "/syllabus",
        isExternal: Boolean(syl.fileUrl),
        keywords: `${syl.title} ${syl.year || ""} syllabus curriculum paper subject pdf download`,
      });
    });

    return catalog;
  }, [liveNotices, liveFaculty, liveSyllabus]);

  // Filter combined catalog by search query & category
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let results = combinedCatalog.filter((item) =>
      [item.name, item.hiName, item.category, item.url, item.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    if (activeCategory !== "all") {
      results = results.filter((item) => item.category === activeCategory);
    }

    return results;
  }, [combinedCatalog, query, activeCategory]);

  const categories = [
    { key: "all", label: isHindi ? "सभी परिणाम" : "All Results" },
    { key: "Notices & Circulars", label: isHindi ? "सूचनाएं" : "Notices" },
    { key: "Faculty & Staff", label: isHindi ? "संकाय" : "Faculty" },
    { key: "Academic Syllabus", label: isHindi ? "पाठ्यक्रम" : "Syllabus" },
    { key: "Admissions", label: isHindi ? "प्रवेश" : "Admissions" },
  ];

  return (
    <>
      <Helmet>
        <title>
          {isHindi
            ? "खोजें | हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
            : "Search | Haryana Shakti College of Education"}
        </title>
        <meta
          name="description"
          content="Search live notices, admissions, syllabus, faculty, and public pages on the HSCE portal."
        />
      </Helmet>

      <main className="min-h-[70vh] w-full bg-[#f8faff] px-4 pb-16 pt-10 font-sans text-gray-900 sm:px-6 sm:pt-14 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          {/* Header Title */}
          <header className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center justify-center rounded-2xl bg-[#0a4b8c]/10 p-3 text-[#0a4b8c]">
              <Compass size={32} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
              {isHindi ? "आप क्या खोज रहे हैं?" : "What are you looking for?"}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              {isHindi
                ? "नवीनतम सूचनाएं, प्रवेश प्रक्रिया, पाठ्यक्रम, संकाय एवं आधिकारिक कॉलेज संसाधन खोजें।"
                : "Real-time search across live circulars, B.Ed. admissions, faculty, syllabus and college pages."}
            </p>

            {/* Live Database Sync Badge */}
            <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                {isHindi ? "लाइव डेटाबेस सिंक सक्रिय" : "Real-Time Portal Database Sync Active"}
              </span>
            </div>
          </header>

          {/* Search Box */}
          <div className="relative w-full">
            <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
              <Search
                className="ml-4 shrink-0 text-slate-400"
                size={20}
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? "यहाँ खोजें (उदा. प्रवेश, बी.एड., सूचना, सविता राठी, पाठ्यक्रम)..."
                    : "Search live notices, admissions, syllabus, faculty, contact..."
                }
                aria-label="Search public website"
                className="w-full bg-transparent px-3.5 py-4 text-sm sm:text-base outline-none placeholder:text-slate-400"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => updateQuery("")}
                  aria-label="Clear search"
                  className="mr-3 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                  <X size={17} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (When query is active) */}
          {query.trim() && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pt-4 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeCategory === cat.key
                      ? "bg-blue-700 text-white shadow-2xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Results Area */}
          <section className="mt-4 w-full" aria-live="polite">
            {!query.trim() ? (
              <div className="mt-8 text-center text-xs sm:text-sm text-slate-500 space-y-2">
                <p>
                  {isHindi
                    ? "त्वरित सुझाव: “प्रवेश”, “बी.एड.”, “संकाय”, “पाठ्यक्रम” या “सूचनाएं” खोजें।"
                    : "Quick suggestions: try “admission”, “b.ed”, “faculty”, “syllabus”, “datesheet”, or “tour”."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {["B.Ed. Admission", "Syllabus PDF", "Principal", "Exam Notice", "Contact Us"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => updateQuery(tag)}
                      className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-blue-700 hover:border-blue-400 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
                  <span>
                    {isHindi
                      ? `${filteredResults.length} परिणाम मिले`
                      : `Found ${filteredResults.length} matching result${filteredResults.length > 1 ? "s" : ""}`}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Live Synced
                  </span>
                </div>

                <ul className="divide-y divide-slate-100">
                  {filteredResults.map((result, idx) => {
                    const isExternal = Boolean(result.isExternal);
                    const isNotice = result.category?.includes("Notice");
                    const isFaculty = result.category?.includes("Faculty");
                    const isSyllabus = result.category?.includes("Syllabus");

                    return (
                      <li key={`${result.url}-${idx}`}>
                        <a
                          href={result.url}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-blue-50/40">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isNotice
                                ? "bg-amber-100 text-amber-800"
                                : isFaculty
                                ? "bg-indigo-100 text-indigo-800"
                                : isSyllabus
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {isNotice ? (
                                <Megaphone size={16} />
                              ) : isFaculty ? (
                                <UserCheck size={16} />
                              ) : isSyllabus ? (
                                <FileText size={16} />
                              ) : (
                                <BookOpen size={16} />
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-1">
                                {isHindi && result.hiCategory ? result.hiCategory : result.category}
                              </span>

                              <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                                {isHindi && result.hiName ? result.hiName : result.name}
                              </h3>

                              <p className="mt-0.5 truncate text-xs text-slate-400 font-mono">
                                {result.url}
                              </p>
                            </div>
                          </div>

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                            {isExternal ? (
                              <ExternalLink size={15} />
                            ) : (
                              <ArrowRight size={15} />
                            )}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="mt-8 text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  {isHindi
                    ? `“${query}” के लिए कोई परिणाम नहीं मिला`
                    : `No results found for “${query}”`}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi
                    ? "कृपया अलग शब्दों या वर्तनी का प्रयास करें।"
                    : "Please try searching with different keywords or check your spelling."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
