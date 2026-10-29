import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Library,
  Laptop,
  Users,
  Presentation,
  Award,
  FlaskConical,
  Clock,
  Compass,
} from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { imageData, imageFallbacks } from "../../data/imagesData";

export function SgtStatsBentoSection() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  return (
    <section
      style={{ backgroundColor: "#f0f5fc" }}
      className="relative overflow-hidden bg-gradient-to-b from-[#eaf2fb] via-[#e2edfa] to-[#f0f5fc] py-14 sm:py-18 lg:py-22 font-sans border-y border-blue-200/70">
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(10,75,140,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(200,16,46,0.1),transparent_40%)]"
      />

      <Container>
        {/* Section Header: Institutional Eminence & Student Teaching */}
        {/* <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-0.5 w-7 bg-[#c8102e]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#c8102e]">
                {isHindi
                  ? "एनसीटीई मान्यता • जीजीएसआईपीयू संबद्धता • शिक्षण अभ्यास"
                  : "NCTE APPROVED & GGSIPU AFFILIATED • PEDAGOGY IN ACTION"}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl lg:text-4xl leading-tight">
              {isHindi ? (
                <>
                  शिक्षक शिक्षा में उत्कृष्टता:{" "}
                  <span className="text-[#0a4b8c]">व्यावहारिक कक्षा शिक्षण एवं मान्यता</span>
                </>
              ) : (
                <>
                  Excellence in Teacher Education:{" "}
                  <span className="text-[#0a4b8c]">Statutory Trust & Hands-on Teaching</span>
                </>
              )}
            </h2>

            <div className="mt-3.5 h-0.5 w-12 rounded-full bg-[#FBDD23]" />

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 100 स्वीकृत सीटों के साथ 2-वर्षीय नियमित बी.एड. डिग्री, 16 सप्ताह का प्रत्यक्ष विद्यालय इंटर्नशिप और आधुनिक प्रयोगशालाओं द्वारा भावी शिक्षकों को वास्तविक कक्षा शिक्षण हेतु तैयार किया जाता है।"
                : "HSCE delivers high-standard teacher education with 100 sanctioned B.Ed. seats, recognized statutory affiliations, 16 weeks of real-school internship, and comprehensive lab resources for classroom-ready educators."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-[#0a4b8c]/30 bg-white/90 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-[#0a4b8c] shadow-xs transition-all duration-300 hover:bg-[#0a4b8c] hover:text-white hover:shadow-md hover:-translate-y-0.5">
              <span>{isHindi ? "संबद्धता आदेश देखें" : "View Affiliations"}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="group inline-flex items-center gap-2 rounded-full bg-[#0a4b8c] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#073665] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <span>{isHindi ? "प्रवेश पूछताछ" : "Enquire for Admission"}</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1 text-[#FBDD23]"
              />
            </button>
          </div>
        </div> */}

        {/* Pedagogical Immersion Pathway: How Our Pupil-Teachers Teach & Train */}
        <div className="mt-12 rounded-2xl border border-blue-200/80 bg-white/95 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0a4b8c]">
                {isHindi
                  ? "प्रशिक्षण से कक्षा तक"
                  : "FROM TRAINING TO CLASSROOM MASTERY"}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {isHindi
                  ? "हमारे छात्र-अध्यापक कैसे सीखते और पढ़ाते हैं (4-चरणीय शिक्षण अभ्यास)"
                  : "How Our Pupil-Teachers Train & Teach: The 4-Step Practical Pedagogy"}
              </h3>
            </div>
            <Link
              to="/course/bed"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4b8c] hover:underline shrink-0">
              <span>
                {isHindi
                  ? "बी.एड. पाठ्यक्रम संरचना"
                  : "B.Ed. Curriculum Structure"}
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-blue-50/50 hover:border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#0a4b8c]">
                  STEP 01
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#0a4b8c] font-black text-xs">
                  1
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0a4b8c]">
                {isHindi ? "माइक्रो-टीचिंग कौशल" : "Micro-Teaching Skills"}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                {isHindi
                  ? "प्रश्नोत्तरी, श्यामपट्ट लेखन और व्याख्या जैसे 8 मूल शिक्षण कौशलों का सिमुलेटेड अभ्यास।"
                  : "Mastery of 8 core skills: questioning, blackboard presentation, explanation, and stimulus variation."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-rose-50/50 hover:border-rose-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#c8102e]">
                  STEP 02
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-[#c8102e] font-black text-xs">
                  2
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#c8102e]">
                {isHindi ? "टीएलएम एवं पाठ योजना" : "TLM & Lesson Design"}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                {isHindi
                  ? "आकर्षक 3D मॉडल, फ्लैशकार्ड्स, चार्ट्स और दैनिक पाठ योजनाओं का पूर्व निर्माण।"
                  : "Hands-on crafting of 3D models, flashcards, interactive charts, and structured daily lesson plans."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-emerald-50/50 hover:border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-emerald-700">
                  STEP 03
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs">
                  3
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                {isHindi
                  ? "16 सप्ताह स्कूल इंटर्नशिप"
                  : "16-Week School Internship"}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                {isHindi
                  ? "दिल्ली के विद्यालयों में वास्तविक कक्षाओं का संचालन, शिक्षण एवं उत्तर-पुस्तिका मूल्यांकन।"
                  : "Real-world teaching practice across partner schools in Delhi with live classroom management."}
              </p>
            </div>

            {/* Step 4 */}
            <div className="group rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:bg-amber-50/50 hover:border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-amber-700">
                  STEP 04
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-black text-xs">
                  4
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-700">
                {isHindi
                  ? "पर्यवेक्षण एवं सीटेट तैयारी"
                  : "Mentorship & CTET Mastery"}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                {isHindi
                  ? "अनुभवी प्राध्यापकों द्वारा 1-on-1 फीडबैक और CTET/DSSSB परीक्षा हेतु विशेष मार्गदर्शन।"
                  : "1-on-1 faculty observation feedback followed by targeted CTET coaching and interview prep."}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SgtStatsBentoSection;
