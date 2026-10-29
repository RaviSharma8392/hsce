import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, GraduationCap, Phone, Menu, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function MobileBottomNav({ mobileMenuOpen, setMobileMenuOpen }) {
  const { isHindi } = useLanguage();
  const location = useLocation();

  const isProgramsActive =
    location.pathname.startsWith("/course") ||
    location.pathname.startsWith("/syllabus");

  const isAdmissionActive = location.pathname.startsWith("/admissions");

  const isContactActive = location.pathname.startsWith("/contact");

  const handleMenuClick = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const itemClass = (isActive) =>
    `flex-1 min-w-0 flex flex-col items-center justify-center
    py-2.5 px-1 transition-colors duration-150
    active:bg-white/10 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-inset
    focus-visible:ring-white/50
    ${
      isActive
        ? "bg-white/10 text-white font-semibold"
        : "bg-transparent text-white/90 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <nav
      aria-label={isHindi ? "मोबाइल नेविगेशन" : "Mobile navigation"}
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto
      w-auto max-w-[380px] lg:hidden">
      <div
        className="flex items-stretch overflow-hidden rounded-full
        border border-white/10 bg-[#1c1c1e] text-white
        shadow-[0_6px_22px_rgba(0,0,0,0.28)]">
        {/* Programs */}
        <Link
          to="/course/bed"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isProgramsActive ? "page" : undefined}
          className={`${itemClass(
            isProgramsActive && !mobileMenuOpen,
          )} border-r border-white/10`}>
          <BookOpen size={21} strokeWidth={2} />

          <span className="mt-1 text-[11px] leading-tight">
            {isHindi ? "प्रोग्राम" : "Programs"}
          </span>
        </Link>

        {/* Admission */}
        <Link
          to="/admissions"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isAdmissionActive ? "page" : undefined}
          className={`${itemClass(
            isAdmissionActive && !mobileMenuOpen,
          )} border-r border-white/10`}>
          <GraduationCap size={22} strokeWidth={2} />

          <span className="mt-1 text-[11px] leading-tight">
            {isHindi ? "प्रवेश" : "Admission"}
          </span>
        </Link>

        {/* Contact */}
        <Link
          to="/contact"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isContactActive ? "page" : undefined}
          className={`${itemClass(
            isContactActive && !mobileMenuOpen,
          )} border-r border-white/10`}>
          <Phone size={20} strokeWidth={2} />

          <span className="mt-1 text-[11px] leading-tight">
            {isHindi ? "संपर्क" : "Contact"}
          </span>
        </Link>

        {/* Menu */}
        <button
          type="button"
          onClick={handleMenuClick}
          aria-expanded={mobileMenuOpen}
          aria-label={
            mobileMenuOpen
              ? isHindi
                ? "मेन्यू बंद करें"
                : "Close menu"
              : isHindi
                ? "मेन्यू खोलें"
                : "Open menu"
          }
          className={`${itemClass(false)} cursor-pointer`}>
          {mobileMenuOpen ? (
            <X size={21} strokeWidth={2} />
          ) : (
            <Menu size={21} strokeWidth={2} />
          )}

          <span className="mt-1 text-[11px] leading-tight">
            {isHindi ? "मेन्यू" : "Menu"}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
