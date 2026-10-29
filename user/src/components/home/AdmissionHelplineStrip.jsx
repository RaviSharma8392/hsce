import React from "react";
import { Link } from "react-router-dom";
import {
  PhoneCall,
  Clock,
  GraduationCap,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { collegeInfo } from "../../data/collegeDetailsData";

export function AdmissionHelplineStrip() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const phone1 = collegeInfo.phone || "9953155054";
  const phone2 = "8056777077";

  return (
    <section className="bg-[#EDF2F8] py-12 sm:py-16 font-sans border-b border-gray-200/90">
      <Container>
        {/* ============================================================== */}
        {/* SECTION HEADER                                                 */}
        {/* ============================================================== */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-1 w-8 bg-[#FBDD23] rounded-none" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi ? "प्रवेश सहायता एवं छात्र सुविधाएं" : "ADMISSION HELPLINE & STUDENT SERVICES"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2E3A8C] leading-tight">
              {isHindi ? "शैक्षणिक सहायता एवं संपर्क केंद्र" : "Admission Guidance & Academic Services"}
            </h2>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. TOP HELPLINE ALERT BANNER (Sharp Design - Numbers Removed)  */}
        {/* ============================================================== */}
        <div className="rounded-none bg-[#00B4D8] px-6 py-4 sm:px-8 sm:py-5 text-white shadow-md border-b border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FBDD23] block mb-0.5">
                {isHindi ? "सत्र 2026-27 प्रवेश सूचना" : "Academic Session 2026-27"}
              </span>
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                {isHindi
                  ? "प्रवेश सहायता एवं परिसर पूछताछ 2026-27"
                  : "ADMISSION HELPLINE & CAMPUS ENQUIRIES 2026-27"}
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-cyan-50 font-normal">
                {isHindi
                  ? "बी.एड. प्रवेश, काउंसलिंग मार्गदर्शन एवं परिसर भ्रमण हेतु हमारी सहायता टीम से संपर्क करें:"
                  : "To enquire about B.Ed. admission, CET/CUET counseling guidance, or campus visits:"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="inline-flex shrink-0 items-center gap-2 rounded-none bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer">
              <span>{isHindi ? "प्रवेश मार्गदर्शन फॉर्म" : "Request Admission Guidance"}</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. 4-TONAL ACTION COLUMNS (Sharp Collegiate Architecture)      */}
        {/* Exact colors from user reference: Cyan -> Crimson Red -> Blue -> Navy */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-none overflow-hidden shadow-xl text-white">
          {/* Column 1: Cyan (#00B4D8) - Admission Support */}
          <div className="flex flex-col justify-between bg-[#00B4D8] p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white/20 text-white mb-5 shadow-xs border border-white/20">
                <PhoneCall size={26} strokeWidth={2.2} />
              </div>

              <h4 className="text-xl font-bold text-white leading-snug tracking-tight">
                {isHindi ? "प्रवेश सहायता केंद्र" : "Admission Support"}
              </h4>

              <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-cyan-50 font-normal">
                {isHindi
                  ? "जीजीएसआईपीयू सीईटी/सीयूईटी काउंसलिंग, पात्रता सत्यापन और बी.एड. आवेदन प्रक्रिया में समर्पित सहायता।"
                  : "Comprehensive counseling guidance for GGSIPU CET / CUET admissions, eligibility criteria verification, and document submission."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <button
                type="button"
                onClick={() => openAdmissionModal()}
                className="inline-flex items-center gap-1.5 rounded-none bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer">
                <span>{isHindi ? "आवेदन पूछताछ" : "Admission Enquiry"}</span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Column 2: Crimson Red / Rose (#D81B60) - Pupil-Teacher Mentoring */}
          <div className="flex flex-col justify-between bg-[#D81B60] p-6 sm:p-7 border-b md:border-b-0 lg:border-r border-white/15">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white/20 text-white mb-5 shadow-xs border border-white/20">
                <Clock size={26} strokeWidth={2.2} />
              </div>

              <h4 className="text-xl font-bold text-white leading-snug tracking-tight">
                {isHindi ? "अध्यापक मार्गदर्शन" : "Pupil-Teacher Mentoring"}
              </h4>

              <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-rose-100 font-normal">
                {isHindi
                  ? "अनुभवी प्राध्यापकों द्वारा 1-on-1 व्यक्तिगत मार्गदर्शन, माइक्रो-टीचिंग सिमुलेशन और सीटेट परीक्षा की तैयारी।"
                  : "Dedicated faculty guidance, constructivist daily lesson planning, micro-teaching simulation drills, and CTET examination coaching."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <Link
                to="/course/bed"
                className="inline-flex items-center gap-1.5 rounded-none bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95">
                <span>{isHindi ? "पाठ्यक्रम देखें" : "B.Ed. Curriculum"}</span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Column 3: Royal Blue (#1E40AF) - School Internship */}
          <div className="flex flex-col justify-between bg-[#1E40AF] p-6 sm:p-7 border-b md:border-b-0 md:border-r border-white/15">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white/20 text-white mb-5 shadow-xs border border-white/20">
                <GraduationCap size={28} strokeWidth={2.2} />
              </div>

              <h4 className="text-xl font-bold text-white leading-snug tracking-tight">
                {isHindi ? "विद्यालय इंटर्नशिप" : "School Internship"}
              </h4>

              <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-blue-100 font-normal">
                {isHindi
                  ? "दिल्ली सरकार के शिक्षा निदेशालय एवं मान्यता प्राप्त वरिष्ठ माध्यमिक विद्यालयों में 16 सप्ताह का प्रत्यक्ष शिक्षण अभ्यास।"
                  : "16 weeks of compulsory hands-on classroom teaching delivery across partner schools under the Delhi Directorate of Education."}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <Link
                to="/about/recognition"
                className="inline-flex items-center gap-1.5 rounded-none bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95">
                <span>{isHindi ? "संबद्धता आदेश" : "Internship Norms"}</span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Column 4: Deep Navy (#0A192F) - Campus Schedule */}
          <div className="flex flex-col justify-between bg-[#0A192F] p-6 sm:p-7">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white/10 text-white mb-5 shadow-xs border border-white/20">
                <Calendar size={26} strokeWidth={2.2} />
              </div>

              <h4 className="text-xl font-bold text-white leading-snug tracking-tight">
                {isHindi ? "कॉलेज समय-सारिणी" : "Campus Schedule"}
              </h4>

              <div className="mt-4 space-y-3.5">
                <div>
                  <button
                    type="button"
                    onClick={() => openAdmissionModal()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FBDD23] hover:underline cursor-pointer">
                    <span>
                      {isHindi ? "परामर्श सत्र समय →" : "Private Counseling Schedule →"}
                    </span>
                  </button>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    {isHindi ? "पूछताछ हेतु:" : "For appointments:"} +91 {phone1} - {phone2}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FBDD23] hover:underline">
                    <span>
                      {isHindi ? "कक्षा व कार्यालय समय →" : "Class & Office Hours →"}
                    </span>
                  </Link>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    {isHindi
                      ? "सोमवार से शनिवार, सुबह 9:00 से शाम 4:00 तक"
                      : "Monday to Saturday, 9:00 AM - 4:00 PM"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 rounded-none bg-[#FBDD23] hover:bg-[#FFDC13] text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95">
                <span>{isHindi ? "संपर्क विवरण देखें" : "Campus Details"}</span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AdmissionHelplineStrip;
