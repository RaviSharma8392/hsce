import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Pin,
  School,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  limit,
  where,
} from "firebase/firestore";

import { db, firebaseReady } from "../../config/firebase";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { cloudinaryImageUrl, imageData } from "../../data/imagesData";
import AdobePdfIcon from "../common/AdobePdfIcon";

const INITIAL_NOTICE_COUNT = 5;
const NOTICE_INCREMENT = 5;

/* ================= NOTICE DATE ================= */

function parseNoticeDate(item) {
  const fields = [
    item?.publicationDate,
    item?.publishedAt,
    item?.importantDate,
    item?.createdAt,
    item?.date,
  ];

  for (const value of fields) {
    if (value == null || value === "") continue;

    let date = null;

    if (typeof value?.toDate === "function") {
      date = value.toDate();
    } else if (typeof value === "number") {
      date = new Date(value);
    } else if (typeof value === "string") {
      date = new Date(value);
    } else if (value instanceof Date) {
      date = value;
    }

    if (date && !Number.isNaN(date.getTime())) {
      return {
        day: String(date.getDate()).padStart(2, "0"),
        month: date.toLocaleString("en", { month: "short" }).toUpperCase(),
        year: String(date.getFullYear()),
        timestamp: date.getTime(),
        valid: true,
      };
    }
  }

  return {
    day: "",
    month: "",
    year: "",
    timestamp: 0,
    valid: false,
  };
}

/* ================= SECTION HEADING ================= */

function SectionHeading({ eyebrow, lead, accent, to, linkLabel }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#FBDD23]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-[#2E3A8C] sm:text-3xl lg:text-[30px] leading-tight">
          {lead} <span className="text-[#2E3A8C]">{accent}</span>
        </h2>
      </div>

      {to && linkLabel && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E3A8C] hover:text-[#1e255a] transition-colors">
          <span>{linkLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C] transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={12} strokeWidth={2.5} />
          </span>
        </Link>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export function NoticeEventsSection() {
  const { isHindi, t } = useLanguage();

  const [liveNotices, setLiveNotices] = useState([]);
  const [visibleNoticeCount, setVisibleNoticeCount] =
    useState(INITIAL_NOTICE_COUNT);

  /* ================= CAMPUS HIGHLIGHTS ================= */

  const campusHighlights = useMemo(
    () => [
      {
        title: isHindi ? "हमारा परिसर" : "Our Campus",
        description: isHindi
          ? "कॉलेज परिसर और उपलब्ध आधुनिक शिक्षण सुविधाओं के बारे में जानें।"
          : "Explore the college campus and its pedagogical facilities.",
        image: imageData.campusHero,
        link: "/about",
        icon: School,
      },
      {
        title: isHindi ? "शैक्षणिक सुविधाएं" : "Academic Facilities",
        description: isHindi
          ? "कक्षाओं, पुस्तकालय, मनोविज्ञान प्रयोगशाला और शिक्षण सुविधाओं की जानकारी।"
          : "Discover classrooms, library, psychology labs and learning spaces.",
        image: imageData.library,
        link: "/about",
        icon: BookOpen,
      },
    ],
    [isHindi],
  );

  /* ================= FIREBASE NOTICES ================= */

  useEffect(() => {
    if (!firebaseReady) {
      return undefined;
    }

    try {
      const noticesQuery = query(
        collection(db, "notices"),
        where("isPublished", "==", true),
        limit(100),
      );

      const unsubscribe = onSnapshot(
        noticesQuery,
        (snapshot) => {
          const records = snapshot.docs
            .map((docSnap) => {
              const data = docSnap.data();

              return {
                ...data,
                id: docSnap.id,
                slug: data.slug || docSnap.id,
                badgeDate: parseNoticeDate(data),
              };
            })
            .filter(
              (notice) =>
                Boolean((notice.title || notice.hiTitle || "").trim()) &&
                notice.isPublished !== false &&
                notice.status !== "draft",
            )
            .sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;

              return (
                (b.badgeDate?.timestamp || 0) - (a.badgeDate?.timestamp || 0)
              );
            });

          setLiveNotices(records);
        },
        (error) => {
          console.warn("Firestore notices sync:", error.message);
          setLiveNotices([]);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn("Firestore subscription error:", error);
      setLiveNotices([]);
      return undefined;
    }
  }, []);

  /* ================= FILTER NOTICES ================= */

  const activeNotices = useMemo(() => {
    return liveNotices
      .filter((notice) => {
        const category = String(notice.category || "")
          .trim()
          .toLowerCase();

        return !category.includes("event");
      })
      .map((notice) => ({
        ...notice,
        badgeDate: notice.badgeDate || parseNoticeDate(notice),
      }))
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        return (b.badgeDate?.timestamp || 0) - (a.badgeDate?.timestamp || 0);
      });
  }, [liveNotices]);

  const displayedNotices = useMemo(
    () => activeNotices.slice(0, visibleNoticeCount),
    [activeNotices, visibleNoticeCount],
  );

  useEffect(() => {
    setVisibleNoticeCount(INITIAL_NOTICE_COUNT);
  }, [liveNotices]);

  /* ================= NEW NOTICE CHECK ================= */

  const isNoticeNew = (timestamp) => {
    if (!timestamp) return false;

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    return timestamp >= sevenDaysAgo && timestamp <= now;
  };

  /* ================= RENDER ================= */

  return (
    <section className="overflow-hidden bg-[#F4F6FA] py-14 font-sans sm:py-16 lg:py-20 border-b border-gray-200/90">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* ================= NOTICE BOARD ================= */}

          <div className="min-w-0 lg:col-span-5">
            <SectionHeading
              eyebrow={isHindi ? "कॉलेज की सूचनाएं" : "NEWS & ANNOUNCEMENTS"}
              lead={isHindi ? "परिसर से " : "Latest from "}
              accent={isHindi ? "नवीनतम" : "Campus"}
              to="/notices"
              linkLabel={t(
                "widgetViewAll",
                isHindi ? "सभी सूचनाएं" : "All notices",
              )}
            />

            {displayedNotices.length > 0 ? (
              <div className="space-y-3 sm:space-y-3.5">
                {displayedNotices.map((notice) => {
                  const date = notice.badgeDate;
                  const isPdf = Boolean(
                    notice.pdfUrl && notice.pdfUrl !== "#",
                  );

                  const isNew = isNoticeNew(date?.timestamp);

                  const Wrapper = isPdf ? "a" : Link;

                  const linkProps = isPdf
                    ? {
                        href: notice.pdfUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {
                        to: "/notices",
                      };

                  const monthDisplay = date?.valid && date.month ? date.month : "—";
                  const dayDisplay = date?.valid && date.day ? date.day : "—";

                  return (
                    <Wrapper
                      key={notice.id || notice.slug || notice.title}
                      {...linkProps}
                      className="group flex min-h-[72px] sm:min-h-[78px] items-stretch overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#2E3A8C]/40">
                      {/* GOLDEN YELLOW DATE BLOCK (#FBDD23 with #2E3A8C text) */}
                      <div className="flex w-[70px] sm:w-[82px] shrink-0 flex-col items-center justify-center bg-[#FBDD23] px-2 py-3 text-[#2E3A8C] font-sans transition-colors group-hover:bg-[#FFDC13]">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider leading-none text-[#2E3A8C]">
                          {monthDisplay}
                        </span>
                        <span className="mt-1 text-xl sm:text-2xl font-extrabold leading-none tracking-tight text-[#2E3A8C]">
                          {dayDisplay}
                        </span>
                      </div>

                      {/* NOTICE TITLE & BADGES */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3 sm:px-5">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {isNew && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#E6646E] text-white">
                              {isHindi ? "नई सूचना" : "NEW"}
                            </span>
                          )}

                          {notice.isPinned && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#2E3A8C] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                              <Pin size={10} className="text-[#2E3A8C]" />
                              <span>{isHindi ? "महत्वपूर्ण" : "IMPORTANT"}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="line-clamp-2 text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#2E3A8C] transition-colors leading-snug">
                          {notice.title ||
                            (isHindi ? "कॉलेज सूचना" : "College Notice")}
                        </h3>
                      </div>

                      {/* ADOBE PDF ICON */}
                      <div className="flex shrink-0 items-center px-3 sm:px-4">
                        <div className="flex items-center justify-center p-1 rounded-lg transition-transform duration-200 group-hover:scale-110">
                          <AdobePdfIcon size={26} className="drop-shadow-xs" />
                        </div>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
                <p className="text-sm font-medium text-gray-700">
                  {isHindi
                    ? "अभी कोई सूचना उपलब्ध नहीं है।"
                    : "No notices available at the moment."}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {isHindi
                    ? "नई सूचनाएं यहां प्रकाशित की जाएंगी।"
                    : "New college announcements will appear here."}
                </p>
              </div>
            )}

            {/* LOAD MORE & VIEW ALL */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {activeNotices.length > visibleNoticeCount ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleNoticeCount((count) =>
                      Math.min(
                        count + NOTICE_INCREMENT,
                        activeNotices.length,
                      ),
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-sm bg-[#2E3A8C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#202965] transition cursor-pointer shadow-xs">
                  <Plus size={14} className="text-[#FBDD23]" />
                  <span>{isHindi ? "और सूचनाएं देखें" : "Load more notices"}</span>
                </button>
              ) : <div />}

              <Link
                to="/notices"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E3A8C] hover:text-[#1e255a] transition-colors">
                <span>{isHindi ? "सभी सूचनाएं देखें" : "View all announcements"}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>

          {/* ================= CAMPUS HIGHLIGHTS ================= */}

          <div className="min-w-0 lg:col-span-7">
            <SectionHeading
              eyebrow={isHindi ? "कॉलेज की जानकारी" : "DISCOVER HSCE"}
              lead={isHindi ? "परिसर की " : "Explore Our "}
              accent={isHindi ? "झलकियां" : "Campus"}
              to="/gallery"
              linkLabel={isHindi ? "गैलरी देखें" : "View Gallery"}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {campusHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.link}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#2E3A8C]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E3A8C]">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={cloudinaryImageUrl(item.image, 900)}
                        width="800"
                        height="600"
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />

                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#2E3A8C] shadow-md backdrop-blur-xs transition-colors group-hover:bg-[#2E3A8C] group-hover:text-[#FBDD23]">
                        <Icon size={19} />
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="flex flex-1 items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 transition-colors group-hover:text-[#2E3A8C]">
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="mt-1 shrink-0 text-[#2E3A8C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ABOUT COLLEGE HIGHLIGHT ROW */}
            <div className="mt-5 border-t border-gray-200/90 pt-5">
              <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                  <GraduationCap size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#2E3A8C] sm:text-base">
                    {isHindi
                      ? "शिक्षा और शिक्षक प्रशिक्षण"
                      : "Education & Teacher Training"}
                  </h3>

                  <p className="mt-0.5 text-xs sm:text-[13px] leading-5 text-slate-500">
                    {isHindi
                      ? "कॉलेज और इसके शैक्षणिक कार्यक्रमों के बारे में और जानें।"
                      : "Learn about the college and its academic programmes."}
                  </p>
                </div>

                <Link
                  to="/about"
                  aria-label={
                    isHindi ? "कॉलेज के बारे में" : "About the college"
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C] transition-transform hover:scale-110 shadow-xs">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default NoticeEventsSection;
