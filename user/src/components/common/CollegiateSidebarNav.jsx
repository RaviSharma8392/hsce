import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * CollegiateSidebarNav
 * Implements the Holy Family institutional sidebar navigation widget:
 * - Solid Royal Navy Blue header (#2E3A8C) with uppercase/title text
 * - Stacked white menu items with divide-y dividers
 * - Active state with left accent border and royal navy highlight
 * - Smooth scroll support for in-page anchor navigation (e.g. #classrooms, #library)
 * - Blue & Yellow Action boxes matching reference Image 1
 * - Institutional Statutory badge (NCTE Approved & GGSIPU Affiliated)
 */
export function CollegiateSidebarNav({
  title = "Navigation",
  items = [],
  quickActions = [],
  showStatutoryCard = true,
  statutoryInfo,
  className = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  const currentFullPath = location.pathname + (location.hash || "");

  // Auto-scroll to anchor hash on mount or hash change if explicit anchor present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Close mobile expanded menu on route change
  useEffect(() => {
    setMobileExpanded(false);
  }, [location.pathname, location.search, location.hash]);

  const getIsActive = (item) => {
    if (item.active !== undefined) return item.active;
    if (item.to) {
      if (item.to.includes("?")) {
        return (location.pathname + location.search) === item.to;
      }
      if (item.to.includes("#")) {
        return currentFullPath === item.to;
      }
      return location.pathname === item.to && !location.hash && !location.search;
    }
    return false;
  };

  const activeItem = items.find(getIsActive) || items[0];

  const handleLinkClick = (e, to) => {
    setMobileExpanded(false);
    if (!to) return;

    if (to.includes("#")) {
      const [path, hash] = to.split("#");
      if (location.pathname === path || (path === "" && location.pathname)) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", to);
        }
        return;
      }
    }

    // Smooth scroll to top when changing tabs or routes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderMenuItem = (item) => {
    const isActive = getIsActive(item);

    const content = (
      <>
        <span className="flex items-center gap-2.5">
          {item.icon && (
            <item.icon
              size={16}
              className={isActive ? "text-[#2E3A8C]" : "text-slate-400"}
            />
          )}
          <span className="leading-snug">{item.label}</span>
        </span>

        {item.badge ? (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isActive
                ? "bg-[#2E3A8C] text-white"
                : "bg-slate-100 text-slate-600"
            }`}>
            {item.badge}
          </span>
        ) : !isActive ? (
          <ArrowUpRight
            size={15}
            className="text-gray-400 shrink-0 group-hover:text-[#2E3A8C] transition-colors"
          />
        ) : null}
      </>
    );

    const itemClasses = `group flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
      isActive
        ? "bg-slate-50 text-[#2E3A8C] font-bold border-l-4 border-l-[#2E3A8C] pl-4"
        : "text-slate-700 hover:bg-slate-50 hover:text-[#2E3A8C]"
    }`;

    if (item.onClick) {
      return (
        <button
          key={item.id || item.label}
          type="button"
          onClick={(e) => {
            setMobileExpanded(false);
            item.onClick(e);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={itemClasses}>
          {content}
        </button>
      );
    }

    if (item.to) {
      return (
        <Link
          key={item.id || item.to}
          to={item.to}
          onClick={(e) => handleLinkClick(e, item.to)}
          className={itemClasses}>
          {content}
        </Link>
      );
    }

    return (
      <div key={item.id || item.label} className={itemClasses}>
        {content}
      </div>
    );
  };

  const renderQuickActions = () => {
    if (!quickActions || quickActions.length === 0) return null;
    return (
      <div className="space-y-2.5">
        {quickActions.map((action, idx) => {
          const isYellow = action.variant === "yellow" || action.variant === "gold";
          const btnClass = isYellow
            ? "bg-[#F5CB1E] hover:bg-[#eab308] text-slate-900 shadow-xs border border-yellow-400/50"
            : "bg-[#2E3A8C] hover:bg-[#232d70] text-white shadow-xs border border-blue-900/20";

          const inner = (
            <div
              className={`w-full py-3 px-4 rounded-md font-bold text-center tracking-wide text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] ${btnClass}`}>
              {action.icon && <action.icon size={16} />}
              <span>{action.label}</span>
            </div>
          );

          if (action.external && action.href) {
            return (
              <a
                key={idx}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileExpanded(false)}
                className="block">
                {inner}
              </a>
            );
          }

          if (action.to) {
            return (
              <Link
                key={idx}
                to={action.to}
                onClick={(e) => handleLinkClick(e, action.to)}
                className="block">
                {inner}
              </Link>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                setMobileExpanded(false);
                action.onClick?.(e);
              }}
              className="block w-full cursor-pointer">
              {inner}
            </button>
          );
        })}
      </div>
    );
  };

  const renderStatutoryCard = () => {
    if (!showStatutoryCard) return null;
    return (
      <div className="rounded-md border border-gray-200/90 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-0.5 w-4 bg-[#F5CB1E]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
            {isHindi ? "वैधानिक मान्यता" : "Statutory Accreditation"}
          </span>
        </div>

        <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug">
          {statutoryInfo?.title || "NCTE Approved & GGSIPU Affiliated"}
        </h4>

        <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
          {statutoryInfo?.description ||
            (isHindi
              ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन एनसीटीई से मान्यता प्राप्त एवं गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU) से संबद्ध है।"
              : "Recognized by National Council for Teacher Education (NCTE) and permanently affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.")}
        </p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#2E3A8C]">
          <span>Code: 147</span>
          <span>100 B.Ed. Seats</span>
        </div>
      </div>
    );
  };

  return (
    <aside className={className}>
      {/* ============================================================== */}
      {/* MOBILE COMPACT SECTION NAV (Matching Reference Card)           */}
      {/* ============================================================== */}
      <div className="lg:hidden mb-6">
        <div className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-md">
          {/* Solid Royal Blue Header Bar */}
          <div className="bg-[#2E3A8C] px-5 py-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              {title}
            </h3>
          </div>

          <nav aria-label={title} className="divide-y divide-gray-100 font-sans">
            {items.map(renderMenuItem)}
          </nav>

          {quickActions && quickActions.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-gray-100">
              {renderQuickActions()}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (100% IDENTICAL & PRESERVED)                   */}
      {/* ============================================================== */}
      <div className="hidden lg:block space-y-6">
        {/* 1. PRIMARY SIDEBAR MENU */}
        <div className="overflow-hidden rounded-md border border-gray-200/90 bg-white shadow-xs">
          <div className="bg-[#2E3A8C] px-5 py-3.5 text-white">
            <h3 className="font-serif text-lg font-bold tracking-wide">
              {title}
            </h3>
          </div>

          <nav className="divide-y divide-gray-100 font-sans">
            {items.map(renderMenuItem)}
          </nav>
        </div>

        {/* 2. ACTION BOXES */}
        {renderQuickActions()}

        {/* 3. STATUTORY TRUST CARD */}
        {renderStatutoryCard()}
      </div>
    </aside>
  );
}
