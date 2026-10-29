import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, GraduationCap, Phone, Menu, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export function MobileBottomNav({ mobileMenuOpen, setMobileMenuOpen }) {
  const { isHindi } = useLanguage();
  const location = useLocation();

  const isHomeActive = location.pathname === "/";
  const isAdmissionActive = location.pathname.startsWith("/admissions");
  const isContactActive = location.pathname.startsWith("/contact");

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMobileMenuOpen((prev) => !prev);
  };

  const itemClass = (isActive) =>
    `flex flex-1 min-w-0 flex-col items-center justify-center gap-1
     py-2 px-1 text-[11px] font-semibold transition-all duration-200
     focus-visible:outline-none
     ${isActive ? "text-[#FBDD23] font-bold" : "text-white/85 hover:text-white"}`;

  return (
    <nav
      aria-label={isHindi ? "मोबाइल नेविगेशन" : "Mobile navigation"}
      className="fixed bottom-3 inset-x-3.5 z-[100] rounded-2xl bg-[#161A26]/95 backdrop-blur-md text-white border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] lg:hidden">
      <div className="flex items-center divide-x divide-white/10 py-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isHomeActive && !mobileMenuOpen ? "page" : undefined}
          className={itemClass(isHomeActive && !mobileMenuOpen)}>
          <Home size={19} strokeWidth={1.9} />
          <span>{isHindi ? "होम" : "Home"}</span>
        </Link>

        {/* 2. Admission */}
        <Link
          to="/admissions"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isAdmissionActive && !mobileMenuOpen ? "page" : undefined}
          className={itemClass(isAdmissionActive && !mobileMenuOpen)}>
          <GraduationCap size={20} strokeWidth={1.9} />
          <span>{isHindi ? "प्रवेश" : "Admission"}</span>
        </Link>

        {/* 3. Connect (Contact / Helplines) */}
        <Link
          to="/contact"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isContactActive && !mobileMenuOpen ? "page" : undefined}
          className={itemClass(isContactActive && !mobileMenuOpen)}>
          <Phone size={18} strokeWidth={1.9} />
          <span>{isHindi ? "संपर्क" : "Connect"}</span>
        </Link>

        {/* 4. Menu (Hamburger Drawer Toggle) */}
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
          className={`${itemClass(mobileMenuOpen)} cursor-pointer`}>
          {mobileMenuOpen ? (
            <X size={19} strokeWidth={2.2} />
          ) : (
            <Menu size={19} strokeWidth={2.2} />
          )}
          <span>{isHindi ? "मेन्यू" : "Menu"}</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
