import React from "react";
import {
  ArrowRight,
  MapPin,
  PhoneCall,
  BookOpen,
  Mail,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { collegeInfo } from "../../data/collegeDetailsData";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { admissionModalData } from "../../data/admissionModalData";
import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";

/* Decorative dot pattern matching second reference image */
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
          id="cta-dot-grid"
          x="0"
          y="0"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="72" height="54" fill="url(#cta-dot-grid)" />
    </svg>
  );
}

export function AdmissionCTA() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const phone1 = collegeInfo.phone || admissionModalData.helplinePhoneFallback || "9953155054";
  const phone2 = "8056777077";

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 font-sans border-b border-gray-200/90">
      {/* Subtle corner dot patterns matching reference image */}
      <DotPattern className="absolute top-6 left-6 text-slate-300/80 pointer-events-none hidden sm:block" />
      <DotPattern className="absolute bottom-6 right-6 text-slate-300/80 pointer-events-none hidden sm:block" />

      <Container>
        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* ============================================================ */}
          {/* LEFT CONTENT: Heading, Real HSCE Story & Action Buttons      */}
          {/* ============================================================ */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* EYEBROW */}
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi ? "प्रवेश आमंत्रण" : "Your Teaching Journey Starts Here"}
              </span>
            </div>

            {/* HEADING (Font & text matching second image) */}
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[40px]">
              {isHindi ? (
                <>
                  शिक्षा के क्षेत्र में अपने{" "}
                  <span className="text-[#2E3A8C]">भविष्य को संवारें</span>
                </>
              ) : (
                <>
                  Explore Your Future in{" "}
                  <span className="text-[#2E3A8C]">Education</span>
                </>
              )}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-slate-600 font-normal">
              {isHindi
                ? "हमारे दो वर्षीय नियमित बी.एड. कार्यक्रम के साथ शिक्षक बनने की दिशा में कदम बढ़ाएं। पाठ्यक्रम, पात्रता, प्रवेश प्रक्रिया और काउंसलिंग की संपूर्ण जानकारी के लिए हमारी टीम से संपर्क करें।"
                : "Discover our two-year regular B.Ed. programme and take the next step towards a career in teaching. Connect with our team to learn about the course, eligibility criteria, admission process, and other important details."}
            </p>

            {/* TWO HIGHLIGHT PILLARS (Matching the style of overview cards) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-200/90 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2E3A8C] text-[#FBDD23]">
                  <GraduationCap size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {isHindi ? "शिक्षक शिक्षा (बी.एड.)" : "Teacher Education (B.Ed.)"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "स्वीकृत सीटें: 100" : "Approved Intake: 100 Seats"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white p-3.5 border border-slate-200/90 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBDD23] text-[#2E3A8C]">
                  <BookOpen size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {isHindi ? "दो वर्षीय नियमित पाठ्यक्रम" : "Two-Year Regular Programme"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "एनसीटीई एवं जीजीएसआईपीयू" : "NCTE & GGSIPU Recognized"}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Solid uppercase buttons matching HomeFeaturedOverview) */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => openAdmissionModal()}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2E3A8C] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#202965] active:scale-[0.98] cursor-pointer">
                <span>{isHindi ? "प्रवेश पूछताछ करें" : "Enquire About Admission"}</span>
                <ArrowRight size={14} className="text-[#FBDD23]" />
              </button>

              <Link
                to="/course/bed"
                className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#FBDD23] px-7 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-xs transition-all hover:bg-[#FFDC13] active:scale-[0.98]">
                <span>{isHindi ? "बी.एड. विवरण देखें" : "Explore B.Ed. Course"}</span>
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDE: 3 CRISP WHITE CONTACT CARDS                      */}
          {/* ============================================================ */}
          <div className="flex flex-col gap-3.5 lg:col-span-5">
            {/* Campus Address Card */}
            <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E3A8C] text-[#FBDD23] shadow-xs">
                <MapPin size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "कैंपस का पता" : "Visit Our Campus"}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold leading-snug text-slate-900">
                  {collegeInfo.address || "Kanjhawala, Delhi – 110081"}
                </p>
                <Link
                  to="/contact"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#2E3A8C] hover:underline">
                  <span>{isHindi ? "स्थान व मानचित्र देखें →" : "View Map & Directions →"}</span>
                </Link>
              </div>
            </div>

            {/* Admissions Helpline Card */}
            <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBDD23] text-[#2E3A8C] shadow-xs">
                <PhoneCall size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "प्रवेश हेल्पलाइन नंबर" : "Admissions Helpline"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${phone1.replace(/\D/g, "")}`}
                    className="text-sm font-bold text-slate-900 hover:text-[#2E3A8C] transition-colors">
                    {phone1}
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href={`tel:${phone2.replace(/\D/g, "")}`}
                    className="text-sm font-bold text-slate-900 hover:text-[#2E3A8C] transition-colors">
                    {phone2}
                  </a>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {isHindi ? "सोम - शनि, 9:00 AM - 4:00 PM" : "Mon - Sat, 9:00 AM - 4:00 PM"}
                </p>
              </div>
            </div>

            {/* Direct Email Card */}
            <div className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E3A8C] text-[#FBDD23] shadow-xs">
                <Mail size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2E3A8C]">
                  {isHindi ? "ईमेल पूछताछ" : "Direct Email Inquiries"}
                </p>
                <a
                  href={`mailto:${collegeInfo.email || "haryanashakticollege@gmail.com"}`}
                  className="mt-0.5 block truncate text-xs sm:text-sm font-bold text-slate-900 hover:text-[#2E3A8C] transition-colors">
                  {collegeInfo.email || "haryanashakticollege@gmail.com"}
                </a>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck size={13} />
                  <span>{isHindi ? "आधिकारिक संस्थान प्रतिक्रिया" : "Official College Helpdesk"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AdmissionCTA;
