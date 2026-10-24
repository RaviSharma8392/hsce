import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Sparkles,
  Building2,
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
import { fallbackWidgetNotices } from "../../data/homeWidgetData";
import { imageData } from "../../data/imagesData";

const THEME_BLUE = "#0a4b8c";
const THEME_YELLOW = "#FBDD23";
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

/* ================= PDF ICON ================= */

function PdfIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-8 w-8 sm:h-9 sm:w-9"
      fill="#d32f2f"
      aria-hidden="true">
      <path d="M7 2C5.895 2 5 2.895 5 4v16c0 1.105.895 2 2 2h10c1.105 0 2-.895 2-2V8l-6-6H7zm6 7V3.5L18.5 9H13z" />
      <path
        d="M7.5 16.5h1.2c1 0 1.6.5 1.6 1.4s-.6 1.4-1.6 1.4H8.5V21h-1v-4.5zm1 2h.2c.4 0 .6-.2.6-.6s-.2-.6-.6-.6h-.2v1.2zm2.5-2h1.3c1.4 0 2.2.9 2.2 2.2s-.8 2.3-2.2 2.3H11v-4.5zm1 3.6h.3c.7 0 1.2-.4 1.2-1.4s-.5-1.3-1.2-1.3H12v2.7zm3.1-3.6h2.7v.9h-1.7v.9h1.5v.9h-1.5V21h-1v-4.5z"
        fill="#fff"
      />
    </svg>
  );
}

/* ================= SECTION HEADING ================= */

function SectionHeading({ lead, accent, to, linkLabel }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-7">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[32px] leading-tight">
          {lead} <span className="font-bold text-[#0a4b8c]">{accent}</span>
        </h2>
        <div className="mt-2.5 h-0.5 w-10 rounded-full bg-[#FBDD23]" />
      </div>

      {to && linkLabel && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-[#0a4b8c] hover:underline">
          <span>{linkLabel}</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export function NoticeEventsSection() {
  const { isHindi, t } = useLanguage();

  const [liveNotices, setLiveNotices] = useState(fallbackWidgetNotices);
  const [visibleNoticeCount, setVisibleNoticeCount] =
    useState(INITIAL_NOTICE_COUNT);

  /* ================= CAMPUS HIGHLIGHTS ================= */

  const campusHighlights = useMemo(
    () => [
      {
        title: isHindi ? "हमारा परिसर" : "Our Campus",
        description: isHindi
          ? "कॉलेज परिसर और उपलब्ध सुविधाओं के बारे में जानें।"
          : "Explore the college campus and its facilities.",
        image: imageData.campusHero,
        link: "/about",
        icon: Building2,
      },
      {
        title: isHindi ? "शैक्षणिक सुविधाएं" : "Academic Facilities",
        description: isHindi
          ? "कक्षाओं, पुस्तकालय और शिक्षण सुविधाओं की जानकारी।"
          : "Discover classrooms, library and learning facilities.",
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
      setLiveNotices(fallbackWidgetNotices);
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
                notice.isPublished !== false && notice.status !== "draft",
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
          setLiveNotices(fallbackWidgetNotices);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.warn("Firestore subscription error:", error);
      setLiveNotices(fallbackWidgetNotices);
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
    <section className="overflow-hidden bg-white py-12 font-sans sm:py-16 lg:py-20 border-t border-slate-200/80">
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

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-shadow hover:shadow-md">
              <div className="h-1.5 bg-gradient-to-r from-[#0a4b8c] via-[#094179] to-[#FBDD23]" />

              {displayedNotices.length > 0 ? (
                <div className="divide-y divide-gray-100">
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

                    return (
                      <Wrapper
                        key={notice.id || notice.slug || notice.title}
                        {...linkProps}
                        className="group flex min-h-[92px] items-stretch transition-colors duration-200 hover:bg-[#f8fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0a4b8c]">
                        {/* Date / document */}
                        <div className="flex w-[68px] shrink-0 flex-col items-center justify-center border-r border-gray-100 bg-[#f7f9fc] px-2 transition-colors group-hover:bg-[#f0f5fb] sm:w-[76px]">
                          {date?.valid ? (
                            <>
                              <span className="text-xl font-bold leading-none text-[#0a4b8c]">
                                {date.day}
                              </span>
                              <span className="mt-1 text-[10px] font-semibold tracking-wide text-gray-500">
                                {date.month}
                              </span>
                              <span className="mt-0.5 text-[10px] text-gray-400">
                                {date.year}
                              </span>
                            </>
                          ) : (
                            <PdfIcon />
                          )}
                        </div>

                        {/* Notice text */}
                        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-4 sm:px-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            {isNew && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-red-600">
                                {isHindi ? "नई सूचना" : "NEW"}
                              </span>
                            )}

                            {notice.isPinned && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-[#0a4b8c]">
                                <Sparkles size={11} />
                                {isHindi ? "महत्वपूर्ण" : "IMPORTANT"}
                              </span>
                            )}
                          </div>

                          <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-gray-800 transition-colors group-hover:text-[#0a4b8c] sm:text-sm">
                            {notice.title ||
                              (isHindi ? "कॉलेज सूचना" : "College Notice")}
                          </h3>
                        </div>

                        {/* Open link */}
                        <div className="flex shrink-0 items-center px-3 sm:px-4">
                          <ArrowUpRight
                            size={17}
                            className="text-gray-400 transition-colors group-hover:text-[#0a4b8c]"
                          />
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
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

              {/* LOAD MORE */}
              {activeNotices.length > visibleNoticeCount && (
                <div className="border-t border-gray-100 px-4 py-3">
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
                    className="mx-auto flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-[#0a4b8c] transition-colors hover:bg-[#f2f7fc]">
                    <Plus size={15} />
                    {isHindi ? "और सूचनाएं देखें" : "Load more notices"}
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/notices"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0a4b8c] hover:underline">
              {isHindi ? "सभी सूचनाएं देखें" : "View all announcements"}
              <ArrowRight size={15} />
            </Link>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {campusHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.link}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4b8c]/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a4b8c]">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#eef3f8]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />

                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#0a4b8c] shadow-md backdrop-blur-xs transition-colors group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23]">
                        <Icon size={19} />
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="flex flex-1 items-start justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-[#0a4b8c]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-[13px] leading-6 text-gray-500">
                          {item.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="mt-1 shrink-0 text-[#0a4b8c]"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ABOUT COLLEGE */}
            <div className="mt-5 border-t border-gray-200 pt-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f2f7fc] text-[#0a4b8c]">
                  <GraduationCap size={23} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {isHindi
                      ? "शिक्षा और शिक्षक प्रशिक्षण"
                      : "Education & Teacher Training"}
                  </h3>

                  <p className="mt-1 text-[13px] leading-5 text-gray-500">
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
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#0a4b8c] transition-colors hover:border-[#FBDD23] hover:bg-[#FBDD23]">
                  <ArrowRight size={17} />
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
