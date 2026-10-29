import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Presentation,
  Layers,
  GraduationCap,
  Award,
} from "lucide-react";
import { Container } from "../common/Container";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";

export function SgtStatsBentoSection() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const pedagogySteps = [
    {
      step: "01",
      number: "1",
      icon: Presentation,
      titleEn: "Micro-Teaching Skills",
      titleHi: "माइक्रो-टीचिंग कौशल",
      descEn:
        "Mastery of 8 core skills: questioning, blackboard presentation, explanation, and stimulus variation in simulated environments.",
      descHi:
        "प्रश्नोत्तरी, श्यामपट्ट लेखन और व्याख्या जैसे 8 मूल शिक्षण कौशलों का सिमुलेटेड अभ्यास।",
      badgeEn: "Simulation Lab",
      badgeHi: "सिमुलेशन लैब",
    },
    {
      step: "02",
      number: "2",
      icon: Layers,
      titleEn: "TLM & Lesson Design",
      titleHi: "टीएलएम एवं पाठ योजना",
      descEn:
        "Hands-on crafting of 3D models, flashcards, interactive charts, and structured daily constructivist lesson plans.",
      descHi:
        "आकर्षक 3D मॉडल, फ्लैशकार्ड्स, चार्ट्स और दैनिक पाठ योजनाओं का पूर्व निर्माण।",
      badgeEn: "Resource Lab",
      badgeHi: "संसाधन लैब",
    },
    {
      step: "03",
      number: "3",
      icon: GraduationCap,
      titleEn: "16-Week School Internship",
      titleHi: "16 सप्ताह स्कूल इंटर्नशिप",
      descEn:
        "Real-world teaching practice across partner schools in Delhi with live classroom delivery and assessment.",
      descHi:
        "दिल्ली के विद्यालयों में वास्तविक कक्षाओं का संचालन, शिक्षण एवं उत्तर-पुस्तिका मूल्यांकन।",
      badgeEn: "Delhi Schools",
      badgeHi: "दिल्ली स्कूल",
    },
    {
      step: "04",
      number: "4",
      icon: Award,
      titleEn: "Mentorship & CTET Mastery",
      titleHi: "पर्यवेक्षण एवं सीटेट तैयारी",
      descEn:
        "1-on-1 faculty observation feedback followed by targeted CTET / DSSSB coaching and mock recruitment drills.",
      descHi:
        "अनुभवी प्राध्यापकों द्वारा 1-on-1 फीडबैक और CTET/DSSSB परीक्षा हेतु विशेष मार्गदर्शन।",
      badgeEn: "Career Ready",
      badgeHi: "करियर तत्पर",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-20 font-sans border-b border-gray-200/90">
      <Container>
        {/* Section Header: Institutional Eminence & Student Teaching */}
        <div className="mb-10 sm:mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi
                  ? "एनसीटीई मान्यता • जीजीएसआईपीयू संबद्धता • शिक्षण अभ्यास"
                  : "NCTE APPROVED & GGSIPU AFFILIATED • PEDAGOGY IN ACTION"}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#2E3A8C] sm:text-3xl lg:text-4xl leading-tight">
              {isHindi ? (
                <>
                  शिक्षक शिक्षा में उत्कृष्टता:{" "}
                  <span className="text-[#2E3A8C]">
                    व्यावहारिक कक्षा शिक्षण एवं मान्यता
                  </span>
                </>
              ) : (
                <>
                  Excellence in Teacher Education:{" "}
                  <span className="text-[#2E3A8C]">
                    Statutory Trust & Hands-on Teaching
                  </span>
                </>
              )}
            </h2>

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 100 स्वीकृत सीटों के साथ 2-वर्षीय नियमित बी.एड. डिग्री, 16 सप्ताह का प्रत्यक्ष विद्यालय इंटर्नशिप और आधुनिक प्रयोगशालाओं द्वारा भावी शिक्षकों को वास्तविक कक्षा शिक्षण हेतु तैयार किया जाता है।"
                : "HSCE delivers high-standard teacher education with 100 sanctioned B.Ed. seats, recognized statutory affiliations, 16 weeks of real-school internship, and comprehensive lab resources for classroom-ready educators."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-sm bg-[#2E3A8C] hover:bg-[#202965] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all">
              <span>{isHindi ? "संबद्धता आदेश देखें" : "View Affiliations"}</span>
              <ArrowRight size={14} className="text-[#FBDD23]" />
            </Link>

            <button
              type="button"
              onClick={() => openAdmissionModal()}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-sm bg-[#FBDD23] hover:bg-[#FFDC13] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-xs transition-all cursor-pointer">
              <span>{isHindi ? "प्रवेश पूछताछ" : "Enquire for Admission"}</span>
              <ArrowRight size={14} className="text-slate-900" />
            </button>
          </div>
        </div>

        {/* Pedagogical Immersion Pathway: The 4-Step Practical Pedagogy */}
        <div className="rounded-2xl border border-gray-200/90 bg-[#F8FAFC] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200/80">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                {isHindi
                  ? "प्रशिक्षण से कक्षा तक"
                  : "FROM TRAINING TO CLASSROOM MASTERY"}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#2E3A8C] mt-1">
                {isHindi
                  ? "हमारे छात्र-अध्यापक कैसे सीखते और पढ़ाते हैं (4-चरणीय शिक्षण अभ्यास)"
                  : "How Our Pupil-Teachers Train & Teach: The 4-Step Practical Pedagogy"}
              </h3>
            </div>
            <Link
              to="/course/bed"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2E3A8C] hover:text-[#1e255a] transition-colors shrink-0">
              <span>
                {isHindi
                  ? "बी.एड. पाठ्यक्रम संरचना"
                  : "B.Ed. Curriculum Structure"}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C]">
                <ArrowRight size={12} strokeWidth={2.5} />
              </span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pedagogySteps.map((item, index) => {
              const Icon = item.icon;
              const isFlagship = index === 2; // 16-Week School Internship

              return (
                <div
                  key={item.step}
                  className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                    isFlagship
                      ? "bg-[#2E3A8C] text-white border-2 border-[#2E3A8C] shadow-md"
                      : "bg-white text-slate-900 border border-slate-200/90 shadow-xs hover:border-[#2E3A8C]/40"
                  }`}>
                  {/* Top highlight bar */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1 transition-all duration-300 ${
                      isFlagship
                        ? "bg-[#FBDD23]"
                        : "bg-slate-200 group-hover:bg-[#2E3A8C]"
                    }`}
                  />

                  <div>
                    {/* Step indicator header */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-105 ${
                          isFlagship
                            ? "bg-[#FBDD23] text-[#2E3A8C]"
                            : "bg-[#2E3A8C] text-[#FBDD23] group-hover:bg-[#FBDD23] group-hover:text-[#2E3A8C]"
                        }`}>
                        <Icon size={22} strokeWidth={2.2} />
                      </div>

                      <span
                        className={`flex h-7 px-3 items-center justify-center rounded-full font-black text-xs tracking-wider shadow-2xs ${
                          isFlagship
                            ? "bg-[#FBDD23] text-[#2E3A8C]"
                            : "bg-slate-100 text-[#2E3A8C] group-hover:bg-[#2E3A8C] group-hover:text-white transition-colors"
                        }`}>
                        STEP {item.step}
                      </span>
                    </div>

                    <h4
                      className={`text-lg font-bold leading-snug transition-colors ${
                        isFlagship ? "text-white" : "text-slate-900 group-hover:text-[#2E3A8C]"
                      }`}>
                      {isHindi ? item.titleHi : item.titleEn}
                    </h4>

                    <p
                      className={`mt-2.5 text-xs sm:text-[13px] leading-relaxed ${
                        isFlagship
                          ? "text-blue-100 font-normal"
                          : "text-slate-600 font-normal"
                      }`}>
                      {isHindi ? item.descHi : item.descEn}
                    </p>
                  </div>

                  <div
                    className={`mt-6 pt-3.5 border-t flex items-center justify-between text-xs font-bold ${
                      isFlagship
                        ? "border-white/15 text-[#FBDD23]"
                        : "border-slate-100 text-[#2E3A8C]"
                    }`}>
                    <span className="uppercase tracking-wider text-[11px]">
                      {isHindi ? item.badgeHi : item.badgeEn}
                    </span>
                    <span
                      className={`h-1.5 w-6 rounded-full group-hover:w-10 transition-all duration-300 ${
                        isFlagship ? "bg-[#FBDD23]" : "bg-[#2E3A8C]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SgtStatsBentoSection;
