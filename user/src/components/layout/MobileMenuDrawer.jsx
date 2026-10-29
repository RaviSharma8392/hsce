import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageCircle,
  Search,
  Sparkles,
  MapPin,
} from "lucide-react";
import { navItems } from "../../data/siteData";
import { imageData } from "../../data/imagesData";
import { useLanguage } from "../../context/LanguageContext";

export function MobileMenuDrawer({ isOpen, onClose, phoneNumber }) {
  const { isHindi, setLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Track expanded accordion item index
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Close drawer ONLY when route actually changes
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Lock body scroll when drawer is open & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleLinkNavigate = (to) => {
    onClose();
    if (to) {
      navigate(to);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const collegePhone = phoneNumber || "9953155054";
  const cleanPhone = String(collegePhone).replace(/[^\d+]/g, "");
  const collegeWhatsapp = String(collegePhone).replace(/\D/g, "");

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-[140] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Off-Canvas Sidebar (Opens from Right Side) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={isHindi ? "नेविगेशन मेन्यू" : "Navigation Menu"}
        className={`fixed top-0 bottom-0 right-0 z-[150] w-[88vw] max-w-[360px] sm:max-w-[400px] bg-white shadow-[-10px_0_40px_rgba(7,30,61,0.25)] flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header: Brand Royal Navy Header with Close Button */}
        <div className="relative shrink-0 bg-[#363991] px-4 py-3.5 text-white border-b border-amber-400/20 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-white p-1 shrink-0 shadow-sm flex items-center justify-center border border-amber-300">
                <img
                  src={imageData.collegeLogo}
                  width="36"
                  height="36"
                  alt="HSCE Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="flex flex-col text-left min-w-0">
                <span className="font-extrabold text-xs sm:text-[13px] text-white leading-tight truncate">
                  {isHindi ? "हरियाणा शक्ति कॉलेज" : "Haryana Shakti College"}
                </span>
                <span className="text-[10px] text-amber-300 font-semibold leading-tight truncate">
                  Approved by NCTE &bull; GGSIPU
                </span>
              </div>
            </div>

            {/* Circular Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label={isHindi ? "मेन्यू बंद करें" : "Close Menu"}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Utility Bar: Language Switcher & Quick Search Link */}
        <div className="shrink-0 bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-white p-0.5 rounded-full border border-slate-200 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                language !== "hi"
                  ? "bg-[#363991] text-[#FBDD23] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                language === "hi"
                  ? "bg-[#363991] text-[#FBDD23] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Quick Search */}
          <button
            type="button"
            onClick={() => handleLinkNavigate("/search")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#363991] hover:border-slate-300 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Search size={13} className="text-slate-400" />
            <span className="text-[11px]">{isHindi ? "खोजें" : "Search"}</span>
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 divide-y divide-slate-100">
          {navItems.map((item, idx) => {
            const hasSubLinks = Boolean(item.subLinks && item.subLinks.length > 0);
            const isExpanded = expandedIndex === idx;
            const itemLabel = isHindi && item.hiLabel ? item.hiLabel : item.label;

            return (
              <div key={item.label || idx} className="py-0.5">
                {hasSubLinks ? (
                  <div>
                    {/* Parent Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left transition-colors cursor-pointer group ${
                        isExpanded
                          ? "bg-blue-50/70 text-[#363991] font-bold"
                          : "text-slate-800 hover:bg-slate-50 font-semibold"
                      }`}
                    >
                      <span className="text-[13px] leading-tight">
                        {itemLabel}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 group-hover:text-[#363991] transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-180 text-[#363991]" : ""
                        }`}
                      />
                    </button>

                    {/* Sublinks Container */}
                    {isExpanded && (
                      <div className="mt-1 mb-2 ml-3 pl-3 border-l-2 border-[#FBDD23]/60 space-y-1 animate-in fade-in duration-150">
                        {item.subLinks.map((sub, subIdx) => {
                          const subLabel = isHindi && sub.hiLabel ? sub.hiLabel : sub.label;
                          const isSubActive = location.pathname === sub.to;

                          return (
                            <button
                              key={sub.to || subIdx}
                              type="button"
                              onClick={() => handleLinkNavigate(sub.to)}
                              className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left text-xs transition cursor-pointer ${
                                isSubActive
                                  ? "bg-[#363991] text-white font-bold"
                                  : "text-slate-600 hover:text-[#363991] hover:bg-slate-50 font-medium"
                              }`}
                            >
                              <span className="truncate pr-2">{subLabel}</span>
                              <ChevronRight
                                size={12}
                                className={isSubActive ? "text-[#FBDD23]" : "text-slate-300"}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single Direct Nav Link */
                  <button
                    type="button"
                    onClick={() => handleLinkNavigate(item.to)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-left text-[13px] font-semibold transition cursor-pointer ${
                      location.pathname === item.to
                        ? "bg-[#363991] text-white font-bold"
                        : "text-slate-800 hover:bg-slate-50 hover:text-[#363991]"
                    }`}
                  >
                    <span>{itemLabel}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Bottom Actions: General Enquiry + Helpline & WhatsApp */}
        <div className="shrink-0 bg-slate-50 border-t border-slate-200/90 p-3.5 space-y-2">
          {/* General Admission Enquiry Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent("open-enquire-tab"));
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#363991] hover:bg-[#282A70] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Sparkles size={14} className="text-[#FBDD23]" />
            <span>{isHindi ? "सामान्य प्रवेश पूछताछ दर्ज करें" : "General Admission Enquiry"}</span>
          </button>

          {/* Quick Contact Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${collegeWhatsapp}?text=${encodeURIComponent(
                "Hello HSCE! I have an admission enquiry regarding B.Ed."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-2xs transition"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-2xs transition"
            >
              <Phone size={13} className="text-[#363991]" />
              <span>{isHindi ? "कॉल करें" : "Call Helpline"}</span>
            </a>
          </div>

          {/* College Address Note */}
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 pt-1 text-center">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">Kanjhawala, Delhi – 110081</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MobileMenuDrawer;
