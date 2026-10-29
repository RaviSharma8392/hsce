import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  ChevronRight,
  GraduationCap,
  Phone,
} from "lucide-react";
import { navItems } from "../../data/siteData";
import { imageData } from "../../data/imagesData";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

export function MobileMenuDrawer({ isOpen, onClose, phoneNumber }) {
  const { isHindi, setLanguage } = useLanguage();
  const { openModal } = useAdmissionModal();
  const navigate = useNavigate();

  // Track expanded accordion items
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleLinkClick = (to) => {
    onClose();
    if (to) navigate(to);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      style={{ backgroundColor: "#ffffff" }}
      className="fixed inset-0 z-40 bg-white pt-4 pb-28 overflow-y-auto flex flex-col justify-between animate-fadeIn lg:hidden">
      <div className="w-full max-w-lg mx-auto px-5 bg-white">
        {/* Top Header Bar Inside Drawer: College Brand + Language Switcher */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <img
              src={imageData.collegeLogo}
              width="432"
              height="432"
              alt="Logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="h-11 w-11 object-contain drop-shadow-xs shrink-0"
            />
            <div className="flex flex-col text-left min-w-0">
              <span className="font-bold text-xs sm:text-sm text-[#1c3274] leading-tight truncate">
                {isHindi ? "हरियाणा शक्ति कॉलेज" : "Haryana Shakti College"}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                {isHindi
                  ? "शिक्षा महाविद्यालय (B.Ed.)"
                  : "College of Education (B.Ed.)"}
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                !isHindi
                  ? "bg-[#1c3274] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}>
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                isHindi
                  ? "bg-[#1c3274] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}>
              हिन्दी
            </button>
          </div>
        </div>

        {/* Accordion Menu List (Matching Image 2 with pure solid white background) */}
        <div className="divide-y divide-slate-100 bg-white">
          {navItems.map((item, idx) => {
            const hasSubLinks = Boolean(
              item.subLinks && item.subLinks.length > 0,
            );
            const isExpanded = expandedIndex === idx;
            const itemLabel =
              isHindi && item.hiLabel ? item.hiLabel : item.label;

            return (
              <div key={item.label || idx} className="py-0.5 bg-white">
                {hasSubLinks ? (
                  <div className="bg-white">
                    {/* Parent Accordion Row */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between py-3.5 px-1 text-left text-slate-800 hover:text-[#1c3274] transition-colors cursor-pointer group bg-white">
                      <span className="text-[15px] sm:text-base font-normal font-sans text-slate-800 group-hover:text-[#1c3274]">
                        {itemLabel}
                      </span>
                      <span className="text-slate-400 group-hover:text-slate-700 transition-colors p-1">
                        {isExpanded ? (
                          <Minus size={18} strokeWidth={2} />
                        ) : (
                          <Plus size={18} strokeWidth={2} />
                        )}
                      </span>
                    </button>

                    {/* Sublinks Container */}
                    {isExpanded && (
                      <div className="pl-3 pr-1 pb-3 space-y-1 bg-[#f8fafc] border border-slate-100 rounded-xl my-1 py-2">
                        {item.subLinks.map((sub, sIdx) => {
                          const subLabel =
                            isHindi && sub.hiLabel ? sub.hiLabel : sub.label;
                          const hasNested = Boolean(
                            sub.subLinks && sub.subLinks.length > 0,
                          );

                          return (
                            <div key={sub.label || sIdx}>
                              {hasNested ? (
                                <div className="py-1">
                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                                    {subLabel}
                                  </span>
                                  <div className="pl-2 space-y-1 border-l-2 border-slate-200 ml-3">
                                    {sub.subLinks.map((nested, nIdx) => (
                                      <Link
                                        key={nested.label || nIdx}
                                        to={nested.to}
                                        onClick={() =>
                                          handleLinkClick(nested.to)
                                        }
                                        className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 hover:text-[#1c3274] hover:bg-white rounded-lg transition font-medium">
                                        <span>
                                          {isHindi && nested.hiLabel
                                            ? nested.hiLabel
                                            : nested.label}
                                        </span>
                                        <ChevronRight
                                          size={13}
                                          className="text-slate-300"
                                        />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  to={sub.to}
                                  onClick={() => handleLinkClick(sub.to)}
                                  className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm text-slate-600 hover:text-[#1c3274] hover:bg-white rounded-lg transition font-medium">
                                  <span>{subLabel}</span>
                                  <ChevronRight
                                    size={14}
                                    className="text-slate-300"
                                  />
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single Link Row without sublinks */
                  <Link
                    to={item.to}
                    onClick={() => handleLinkClick(item.to)}
                    className="w-full flex items-center justify-between py-3.5 px-1 text-[15px] sm:text-base font-normal font-sans text-slate-800 hover:text-[#1c3274] transition-colors bg-white">
                    <span>{itemLabel}</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Action CTA inside drawer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5 bg-white">
          <button
            type="button"
            onClick={() => {
              onClose();
              openModal();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FBDD23] hover:bg-[#ebd020] text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition">
            <GraduationCap size={16} />
            <span>
              {isHindi
                ? "ऑनलाइन प्रवेश 2026-27"
                : "Apply for Admission 2026-27"}
            </span>
          </button>

          <Link
            to="/contact/enquiry"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 font-bold text-xs transition">
            <span>
              {isHindi ? "ऑनलाइन प्रवेश व कॉलेज पूछताछ" : "Send an Admission Enquiry"}
            </span>
          </Link>

          <a
            href={`tel:${String(phoneNumber || "").replace(/[^\d+]/g, "")}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition">
            <Phone size={14} className="text-[#1c3274]" />
            <span>
              {isHindi
                ? `हेल्पलाइन कॉल: ${phoneNumber}`
                : `Call Helpline: ${phoneNumber}`}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MobileMenuDrawer;
