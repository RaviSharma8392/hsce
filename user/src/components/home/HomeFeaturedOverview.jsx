import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

/* =========================================================================
   DECORATIVE DOT PATTERN (Matching user screenshot)
   ========================================================================= */
function DotPattern({ className = "" }) {
  return (
    <svg
      width="72"
      height="54"
      viewBox="0 0 72 54"
      fill="none"
      className={className}
      aria-hidden="true">
      <defs>
        <pattern
          id="overview-dot-grid"
          x="0"
          y="0"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="72" height="54" fill="url(#overview-dot-grid)" />
    </svg>
  );
}

/* =========================================================================
   TOP 3 CARD OUTLINE ICONS (Matching user screenshot)
   ========================================================================= */

// University / Institution outline building icon with cross/crest (matching screenshot card 1)
function CollegeBuildingIcon({ className = "" }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      {/* Outer Building */}
      <rect x="7" y="10" width="24" height="24" rx="2" />
      {/* Front Gable / Pediment */}
      <path d="M7 10L19 3L31 10" />
      {/* Academic Cross / Emblem */}
      <path d="M19 7V13M16 10H22" />
      {/* Windows grid */}
      <rect x="11" y="14" width="4" height="4" rx="0.5" />
      <rect x="23" y="14" width="4" height="4" rx="0.5" />
      <rect x="11" y="21" width="4" height="4" rx="0.5" />
      <rect x="23" y="21" width="4" height="4" rx="0.5" />
      {/* Entrance Doorway */}
      <path d="M16 34V27C16 26.4 16.4 26 17 26H21C21.6 26 22 26.4 22 27V34" />
      {/* Foundation Line */}
      <line x1="4" y1="34" x2="34" y2="34" />
    </svg>
  );
}

// Glowing Idea / Contact Lightbulb with radiant rays (matching screenshot card 2)
function ContactBulbIcon({ className = "" }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      {/* Lightbulb outline */}
      <path d="M19 8C14.6 8 11 11.6 11 16C11 18.8 12.4 21.2 14.6 22.6C15.3 23.1 15.7 24 15.8 24.9L16 26H22L22.2 24.9C22.3 24 22.7 23.1 23.4 22.6C25.6 21.2 27 18.8 27 16C27 11.6 23.4 8 19 8Z" />
      {/* Base */}
      <path d="M16 29H22" />
      <path d="M17.5 32H20.5" />
      {/* Radiant Sunburst rays */}
      <line x1="19" y1="3" x2="19" y2="5" />
      <line x1="8.4" y1="7.4" x2="9.8" y2="8.8" />
      <line x1="4" y1="16" x2="6" y2="16" />
      <line x1="29.6" y1="7.4" x2="28.2" y2="8.8" />
      <line x1="34" y1="16" x2="32" y2="16" />
    </svg>
  );
}

// Question / Query Bulb with sparkles (matching screenshot card 3)
function QueryBulbIcon({ className = "" }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      {/* Lightbulb outline */}
      <path d="M19 8C14.6 8 11 11.6 11 16C11 18.8 12.4 21.2 14.6 22.6C15.3 23.1 15.7 24 15.8 24.9L16 26H22L22.2 24.9C22.3 24 22.7 23.1 23.4 22.6C25.6 21.2 27 18.8 27 16C27 11.6 23.4 8 19 8Z" />
      <path d="M16 29H22" />
      <path d="M17.5 32H20.5" />
      {/* Radiant Lines */}
      <line x1="19" y1="2" x2="19" y2="5" />
      <line x1="7" y1="7" x2="9.5" y2="9.5" />
      <line x1="2" y1="16" x2="5" y2="16" />
      <line x1="31" y1="7" x2="28.5" y2="9.5" />
      <line x1="36" y1="16" x2="33" y2="16" />
      <line x1="7" y1="25" x2="9.5" y2="23" />
      <line x1="31" y1="25" x2="28.5" y2="23" />
    </svg>
  );
}

/* =========================================================================
   4 ILLUSTRATED AVATARS (Matching user screenshot pixel-for-pixel!)
   ========================================================================= */

// 1. Enrolled Student Avatar (Female student with brunette pigtails, blue ribbons & shirt)
function StudentAvatar() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs">
      {/* Pigtails / Hair back */}
      <circle cx="16" cy="30" r="7" fill="#8B4513" />
      <circle cx="48" cy="30" r="7" fill="#8B4513" />
      {/* Blue Ribbon Ties */}
      <rect x="18" y="27" width="4" height="5" rx="1.5" fill="#3B82F6" />
      <rect x="42" y="27" width="4" height="5" rx="1.5" fill="#3B82F6" />
      {/* Body / Pastel Blue Shirt */}
      <path d="M18 56C18 45 24 42 32 42C40 42 46 45 46 56" fill="#60A5FA" />
      {/* Neck & Face */}
      <rect x="29" y="36" width="6" height="7" rx="2" fill="#FED7AA" />
      <circle cx="32" cy="26" r="11" fill="#FED7AA" />
      {/* Hair Bangs */}
      <path
        d="M21 24C21 17 25 14 32 14C39 14 43 17 43 24C41 19 36 18 32 18C28 18 23 19 21 24Z"
        fill="#8B4513"
      />
      {/* Friendly Eyes & Smile */}
      <circle cx="28" cy="26" r="1.3" fill="#1F2937" />
      <circle cx="36" cy="26" r="1.3" fill="#1F2937" />
      <path
        d="M30 30C31 31.5 33 31.5 34 30"
        stroke="#DC2626"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Rosy Cheeks */}
      <circle cx="25" cy="28" r="1.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="39" cy="28" r="1.5" fill="#FCA5A5" opacity="0.6" />
    </svg>
  );
}

// 2. Alumni Graduate Avatar (Graduate with black mortarboard cap & gown)
function AlumniAvatar() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs">
      {/* Body / Academic Gown */}
      <path d="M18 56C18 45 24 42 32 42C40 42 46 45 46 56" fill="#EA580C" />
      <path d="M29 42L32 49L35 42" fill="#FED7AA" />
      {/* Neck & Face */}
      <rect x="29" y="36" width="6" height="7" rx="2" fill="#FED7AA" />
      <circle cx="32" cy="28" r="10.5" fill="#FED7AA" />
      {/* Hair under cap */}
      <path d="M22 28C22 23 25 21 32 21C39 21 42 23 42 28" fill="#451A03" />
      {/* Black Mortarboard Graduation Cap */}
      <path d="M32 10L16 17L32 24L48 17L32 10Z" fill="#1E293B" />
      <path
        d="M24 21V26C24 28 28 30 32 30C36 30 40 28 40 26V21"
        fill="#0F172A"
      />
      {/* Gold Tassel */}
      <path
        d="M32 17L44 20V26"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="27" r="1.5" fill="#F59E0B" />
      {/* Eyes & Smile */}
      <circle cx="28" cy="29" r="1.3" fill="#1F2937" />
      <circle cx="36" cy="29" r="1.3" fill="#1F2937" />
      <path
        d="M30 33C31 34.2 33 34.2 34 33"
        stroke="#DC2626"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 3. Faculty Teacher Avatar (Female teacher with brown hair, glasses, pink blouse & book)
function FacultyAvatar() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs">
      {/* Hair back */}
      <circle cx="32" cy="27" r="13" fill="#78350F" />
      {/* Body / Pink Blouse */}
      <path d="M19 56C19 45 25 42 32 42C39 42 45 45 45 56" fill="#F472B6" />
      {/* Green Book in Hands */}
      <rect x="23" y="46" width="18" height="11" rx="2" fill="#10B981" />
      <rect x="31" y="46" width="2" height="11" fill="#059669" />
      <line
        x1="26"
        y1="49"
        x2="29"
        y2="49"
        stroke="white"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <line
        x1="35"
        y1="49"
        x2="38"
        y2="49"
        stroke="white"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      {/* Neck & Face */}
      <rect x="29" y="36" width="6" height="7" rx="2" fill="#FED7AA" />
      <circle cx="32" cy="26" r="10.5" fill="#FED7AA" />
      {/* Hair Bangs */}
      <path
        d="M21 23C21 16 26 14 32 14C38 14 43 16 43 23C39 18 35 18 32 19C29 18 25 18 21 23Z"
        fill="#78350F"
      />
      {/* Glasses */}
      <rect
        x="24"
        y="23.5"
        width="6"
        height="5"
        rx="1.5"
        stroke="#1E293B"
        strokeWidth="1.2"
        fill="#F8FAFC"
        fillOpacity="0.4"
      />
      <rect
        x="34"
        y="23.5"
        width="6"
        height="5"
        rx="1.5"
        stroke="#1E293B"
        strokeWidth="1.2"
        fill="#F8FAFC"
        fillOpacity="0.4"
      />
      <line
        x1="30"
        y1="26"
        x2="34"
        y2="26"
        stroke="#1E293B"
        strokeWidth="1.2"
      />
      {/* Eyes & Smile */}
      <circle cx="27" cy="26" r="1" fill="#1E293B" />
      <circle cx="37" cy="26" r="1" fill="#1E293B" />
      <path
        d="M30 31.5C31 32.8 33 32.8 34 31.5"
        stroke="#E11D48"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4. Courses / Stack of Books with Red Mortarboard Avatar
function CoursesAvatar() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs">
      {/* Bottom Book (Yellow) */}
      <path
        d="M18 48C18 46.5 20 45 32 45C44 45 46 46.5 46 48V53C46 53 42 54 32 54C22 54 18 53 18 53V48Z"
        fill="#F59E0B"
      />
      <path d="M20 49H44V51H20V49Z" fill="#FEF3C7" />
      {/* Middle Book (Teal/Green) */}
      <path
        d="M19 41C19 39.5 21 38 32 38C43 38 45 39.5 45 41V46C45 46 41 47 32 47C23 47 19 46 19 46V41Z"
        fill="#0D9488"
      />
      <path d="M21 42H43V44H21V42Z" fill="#CCFBF1" />
      {/* Top Book (Blue) */}
      <path
        d="M20 34C20 32.5 22 31 32 31C42 31 44 32.5 44 34V39C44 39 40 40 32 40C24 40 20 39 20 39V34Z"
        fill="#2563EB"
      />
      <path d="M22 35H42V37H22V35Z" fill="#DBEAFE" />
      {/* Red Mortarboard Cap Perched on Top */}
      <path d="M32 15L19 21L32 27L45 21L32 15Z" fill="#E11D48" />
      <path
        d="M26 24V27C26 28.5 29 30 32 30C35 30 38 28.5 38 27V24"
        fill="#BE123C"
      />
      {/* Gold Tassel */}
      <path
        d="M32 21L43 24V29"
        stroke="#FBBF24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="43" cy="29.5" r="1.5" fill="#FBBF24" />
    </svg>
  );
}

/* =========================================================================
   MAIN COMPONENT: HomeFeaturedOverview
   Faithful reproduction of user reference design with 100% REAL HSCE CONTENT
   ========================================================================= */
export function HomeFeaturedOverview() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <section className="relative overflow-hidden bg-white font-sans border-b border-gray-200/90">
      {/* ============================================================== */}
      {/* 1. TOP 3 SOLID ACTION CARDS (Blue | Yellow | Blue)            */}
      {/* ============================================================== */}
      <div className="bg-[#2E3A8C] border-b border-gray-200/80">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Card 1: GGSIPU Affiliation (Blue) */}
            <a
              href="http://www.ipu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-[#2E3A8C] hover:bg-[#252F72] px-6 py-5 sm:py-6 text-white transition-colors duration-200 border-b md:border-b-0 md:border-r border-white/10">
              <div className="shrink-0 text-white">
                <CollegeBuildingIcon className="text-white group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-[19px] font-bold text-white leading-tight">
                  {isHindi ? "जीजीएसआईपीयू संबद्धता" : "GGSIPU Affiliation"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FBDD23]">
                  <span>{isHindi ? "आधिकारिक वेबसाइट" : "Website"}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </a>

            {/* Card 2: Contact Us (Bright Golden Yellow) */}
            <Link
              to="/contact"
              className="group flex items-center gap-4 bg-[#FBDD23] hover:bg-[#FFDC13] px-6 py-5 sm:py-6 text-slate-900 transition-colors duration-200 border-b md:border-b-0 md:border-r border-slate-900/10">
              <div className="shrink-0 text-slate-900">
                <ContactBulbIcon className="text-slate-900 group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-[19px] font-bold text-slate-900 leading-tight">
                  {isHindi ? "संपर्क करें" : "Contact Us"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900">
                  <span className="underline decoration-slate-900/40 underline-offset-2">
                    {isHindi ? "यहाँ देखें" : "Here"}
                  </span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1 text-slate-900"
                  />
                </div>
              </div>
            </Link>

            {/* Card 3: Ask Questions / Apply (Blue) */}
            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="group flex items-center gap-4 bg-[#2E3A8C] hover:bg-[#252F72] px-6 py-5 sm:py-6 text-white transition-colors duration-200 text-left cursor-pointer">
              <div className="shrink-0 text-white">
                <QueryBulbIcon className="text-white group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-[19px] font-bold text-white leading-tight">
                  {isHindi ? "सवाल पूछें" : "Ask Questions"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FBDD23]">
                  <span>{isHindi ? "आवेदन करें" : "Apply"}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </button>
          </div>
        </Container>
      </div>

      {/* ============================================================== */}
      {/* 2. OVERVIEW BODY & 2x2 ILLUSTRATED AVATAR STAT CARDS          */}
      {/* ============================================================== */}
      <div className="relative bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Subtle Decorative Dot Matrix Patterns in Corners */}
        <DotPattern className="absolute top-6 left-6 text-slate-300/80 pointer-events-none hidden sm:block" />
        <DotPattern className="absolute top-6 right-6 text-slate-300/80 pointer-events-none hidden sm:block" />

        <Container>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Real HSCE Story, 2 Solid Navy Buttons */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
                {isHindi ? "संस्थान परिचय (Overview)" : "Overview"}
              </h2>

              <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-slate-600 font-normal">
                {isHindi
                  ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय (GGSIPU), दिल्ली (कॉलेज कोड: 147) से संबद्ध और राष्ट्रीय अध्यापक शिक्षा परिषद (NRC-NCTE) द्वारा विधिवत मान्यता प्राप्त है। हरियाणा शक्ति एजुकेशन सोसाइटी (2012 में कंझावला, दिल्ली में स्थापित) के तत्वावधान में संचालित यह महाविद्यालय शिक्षक शिक्षा में शैक्षणिक उत्कृष्टता का एक प्रतिष्ठित केंद्र है। महाविद्यालय 100 स्वीकृत वार्षिक सीटों के साथ 2-वर्षीय नियमित बी.एड. पाठ्यक्रम, 16 सप्ताह का गहन विद्यालय इंटर्नशिप और आधुनिक पाठ्यचर्या प्रयोगशालाएं प्रदान करता है।"
                  : "The Haryana Shakti College of Education is affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi (College Code: 147) and recognized by the National Council for Teacher Education (NRC-NCTE). Managed under the visionary leadership of Haryana Shakti Education Society (established in 2012 in Kanjhawala, Delhi), the college aims to be a centre of academic excellence in professional teacher education. HSCE offers a comprehensive two-year regular Bachelor of Education (B.Ed.) programme with an approved intake of 100 annual seats, combining rigorous pedagogy, 16 weeks of practical school internship across Delhi schools, and modern curriculum laboratories to prepare dedicated, future-ready educators."}
              </p>

              {/* Two Solid Navy Blue Buttons (Matching user screenshot) */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/about"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#2E3A8C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#202965] active:scale-[0.98]">
                  <span>{isHindi ? "और पढ़ें (READ MORE)" : "READ MORE"}</span>
                </Link>

                <Link
                  to="/book-a-tour"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#2E3A8C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#202965] active:scale-[0.98]">
                  <span>
                    {isHindi ? "परिसर भ्रमण (CAMPUS TOUR)" : "VISIT CAMPUS TOUR"}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column: Genuine HSCE Educational Parameters & Accreditation */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* 2x2 Grid of Genuine Verified Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Genuine Metric 1: Sanctioned Annual Intake */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <StudentAvatar />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C] leading-snug">
                      {isHindi ? "स्वीकृत वार्षिक सीटें" : "Sanctioned Seats"}
                    </p>
                    <p className="mt-0.5 text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                      100
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
                      {isHindi ? "एनसीटीई एवं जीजीएसआईपीयू" : "Annual B.Ed. Intake"}
                    </p>
                  </div>
                </div>

                {/* Genuine Metric 2: School Internship */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <AlumniAvatar />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C] leading-snug">
                      {isHindi ? "स्कूल इंटर्नशिप" : "School Internship"}
                    </p>
                    <p className="mt-0.5 text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                      16 Wks
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
                      {isHindi ? "दिल्ली के स्कूलों में शिक्षण" : "Delhi Partner Schools"}
                    </p>
                  </div>
                </div>

                {/* Genuine Metric 3: Established Legacy */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <FacultyAvatar />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C] leading-snug">
                      {isHindi ? "स्थापना वर्ष" : "Estd. Year"}
                    </p>
                    <p className="mt-0.5 text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                      2012
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
                      {isHindi ? "14+ वर्षों का शैक्षणिक अनुभव" : "14+ Yrs of Legacy"}
                    </p>
                  </div>
                </div>

                {/* Genuine Metric 4: Curriculum Resource Labs */}
                <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <CoursesAvatar />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C] leading-snug">
                      {isHindi ? "पाठ्यचर्या प्रयोगशालाएं" : "Pedagogy Labs"}
                    </p>
                    <p className="mt-0.5 text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
                      5+
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">
                      {isHindi ? "आईसीटी, मनोविज्ञान व टीएलएम" : "ICT, Psychology & TLM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statutory Accreditation & Regulatory Verification Card (Added genuine institutional strengths) */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                    <ShieldCheck size={18} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {isHindi ? "वैधानिक मान्यता एवं विश्वविद्यालय संबद्धता" : "Statutory NCTE Approval & GGSIPU Affiliation"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? "संबद्धता कोड: 147 • आदेश सं.: F.NRC/NCTE/HR-451" : "Affiliation Code: 147 • Order No: F.NRC/NCTE/HR-451"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/mandatory-disclosure"
                  className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E3A8C] hover:text-[#1e255a] transition-colors">
                  <span>{isHindi ? "दस्तावेज देखें" : "Disclosures"}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default HomeFeaturedOverview;
