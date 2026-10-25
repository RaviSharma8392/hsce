import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAdmissionModal } from "../../context/AdmissionModalContext";
import { Container } from "../common/Container";

export default function ProgrammeHighlights() {
  const { isHindi } = useLanguage();
  const { openAdmissionModal } = useAdmissionModal();

  const programmeSteps = [
    {
      number: "01",
      titleEn: "Foundation & Pedagogy",
      titleHi: "आधारभूत शिक्षण एवं सिद्धांत",
      descEn:
        "Educational psychology, curriculum planning, inclusive classrooms, and domain-specific teaching methodologies.",
      descHi:
        "शैक्षिक मनोविज्ञान, पाठ्यचर्या निर्माण, समावेशी शिक्षा और विषयवार आधुनिक शिक्षण पद्धतियां।",
      icon: BookOpenCheck,
    },
    {
      number: "02",
      titleEn: "16-Week School Internship",
      titleHi: "16-सप्ताह स्कूल इंटर्नशिप",
      descEn:
        "Hands-on classroom immersion, lesson delivery, student evaluation, and micro-teaching practice across Delhi schools.",
      descHi:
        "दिल्ली के प्रतिष्ठित विद्यालयों में 16 सप्ताह का वास्तविक शिक्षण अभ्यास, माइक्रो-टीचिंग और मूल्यांकन।",
      icon: Building2,
    },
    {
      number: "03",
      titleEn: "CTET & Career Readiness",
      titleHi: "सीटेट एवं करियर तत्परता",
      descEn:
        "Targeted CTET preparation, personality development, mock recruitment interviews, and direct school placement assistance.",
      descHi:
        "सीटेट परीक्षा की विशेष तैयारी, व्यक्तित्व विकास, साक्षात्कार मार्गदर्शन और विद्यालयों में प्लेसमेंट सहायता।",
      icon: TrendingUp,
    },
  ];

  return (
    <section
      style={{ backgroundColor: "#0a4b8c" }}
      className="relative isolate overflow-hidden border-y border-blue-900/50 bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] font-sans text-white">
      {/* Decorative wave background synced across institutional blue sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -bottom-20 -left-24 h-[650px] w-[850px] max-w-none opacity-20 sm:-left-10 lg:-bottom-32 lg:left-[5%] lg:h-[850px] lg:w-[1000px]"
          viewBox="0 0 800 800"
          fill="none">
          {Array.from({ length: 32 }).map((_, i) => (
            <path
              key={i}
              d={`M ${40 + i * 8} 820 C ${100 + i * 12} ${560 - i * 5}, ${320 + i * 8} ${260 - i * 7}, ${800} ${80 + i * 12}`}
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/15 sm:h-[450px] sm:w-[450px]" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/15 sm:h-[350px] sm:w-[350px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#052243]/50" />
      </div>

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[0.75fr_1.6fr] px-4 sm:px-6 lg:px-8">
        {/* Left Column: Programme Identity */}
        <div className="relative flex flex-col justify-center px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:border-r lg:border-white/15 lg:px-10 lg:py-24 xl:px-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-0.5 w-8 bg-[#FBDD23]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBDD23]">
              {isHindi ? "बी.एड. कार्यक्रम" : "B.Ed. Programme"}
            </span>
          </div>

          <h2 className="max-w-sm text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.1rem]">
            {isHindi ? "बी.एड. कार्यक्रम" : "B.Ed. Programme"}
            <span className="mt-2 block font-medium text-white/85 text-2xl sm:text-3xl lg:text-[2.2rem]">
              {isHindi ? "2-वर्षीय नियमित डिग्री।" : "2-Year Regular Degree."}
            </span>
          </h2>

          <p className="mt-6 max-w-xs text-sm leading-7 text-white/85 sm:text-base">
            {isHindi
              ? "एनसीटीई द्वारा अनुमोदित एवं जीजीएसआईपीयू दिल्ली से संबद्ध। भावी शिक्षकों को आधुनिक शिक्षण कौशल, व्यावहारिक अनुभव और नैतिक मूल्यों से सशक्त बनाने हेतु समर्पित।"
              : "Duly approved by NCTE and affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi. Dedicated to preparing transformative, reflective, and future-ready school educators."}
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/90">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-[#FBDD23]">
              <GraduationCap size={16} />
            </span>
            <span>
              {isHindi
                ? "वार्षिक सीटें: 100 • NCTE एवं GGSIPU मान्यता"
                : "Approved Intake: 100 Seats • NCTE & GGSIPU"}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-8 hidden text-[100px] font-bold leading-none text-white/[0.07] lg:block xl:right-12 xl:text-[130px]">
            B.Ed.
          </span>
        </div>

        {/* Right Column: Step-by-Step Pathway */}
        <div className="px-4 pb-12 pt-5 sm:px-8 sm:pb-16 lg:px-10 lg:py-24 xl:px-12">
          <h3 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
            {isHindi ? (
              <>
                भावी शिक्षकों को गढ़ने वाली{" "}
                <span className="text-[#FBDD23]">व्यावसायिक शिक्षण यात्रा</span>
              </>
            ) : (
              <>
                A Professional Journey That Shapes{" "}
                <span className="text-[#FBDD23]">Transformative Educators</span>
              </>
            )}
          </h3>

          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-blue-50/90 sm:text-base sm:leading-8 font-normal">
            <p>
              {isHindi
                ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में 2-वर्षीय नियमित बी.एड. डिग्री कार्यक्रम एनसीटीई एवं जीजीएसआईपीयू के नवीनतम पाठ्यचर्या के अनुसार संचालित किया जाता है। यह भावी शिक्षकों को कक्षा शिक्षण, शैक्षिक मनोविज्ञान और शिक्षण तकनीकों में पारंगत बनाता है।"
                : "The Bachelor of Education (B.Ed.) at HSCE is a premier two-year regular professional programme aligning NCTE statutory guidelines with GGSIPU curriculum to equip teacher candidates with pedagogical brilliance, reflective thinking, and modern instructional strategies."}
            </p>

            <p>
              {isHindi
                ? "सैद्धांतिक ज्ञान के साथ-साथ माइक्रो-टीचिंग, स्कूल इंटर्नशिप, पाठ्यचर्या प्रयोगशालाओं और शिक्षण सहायक सामग्री निर्माण के माध्यम से विद्यार्थियों को शिक्षण पेशे के लिए पूर्णतः तैयार किया जाता है।"
                : "From foundational pedagogical philosophy and psychology laboratories to simulation teaching and extensive 16-week school internships across Delhi, the curriculum ensures comprehensive classroom mastery and career confidence."}
            </p>
          </div>

          {/* 3 Step-by-Step Feature Cards (01, 02, 03) */}
          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {programmeSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-white/20 bg-white/[0.08] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FBDD23]/70 hover:bg-white/[0.14] sm:p-4 lg:p-5">
                  <div className="mb-6 flex items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FBDD23] text-[#0a4b8c] shadow-xs">
                      <Icon size={20} strokeWidth={2} />
                    </span>

                    <span className="text-xs font-bold tracking-widest text-white/55">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="text-base font-bold leading-snug sm:text-lg">
                    {isHindi ? step.titleHi : step.titleEn}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-blue-50/80">
                    {isHindi ? step.descHi : step.descEn}
                  </p>

                  <div className="mt-5 h-0.5 w-8 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-14" />
                </article>
              );
            })}
          </div>

          {/* Bottom Call to Action Bar */}
          <div className="mt-8 flex flex-col gap-4 border-t border-white/20 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                {isHindi
                  ? "प्रवेश सत्र 2026-27 के लिए आवेदन करें।"
                  : "Admissions Open for Session 2026-27."}
              </p>
              <p className="mt-1 text-sm text-blue-100/75">
                {isHindi
                  ? "पात्रता मापदंड, पाठ्यक्रम विवरण और प्रवेश प्रक्रिया देखें।"
                  : "Check eligibility criteria, syllabus modules and counselling steps."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  openAdmissionModal({
                    defaultProgramme: "B.Ed. (Bachelor of Education - 2 Years)",
                  })
                }
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#FBDD23] px-6 py-3 text-sm font-bold text-gray-900 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffe338] hover:shadow-lg cursor-pointer">
                <span>{isHindi ? "बी.एड. हेतु आवेदन करें" : "Apply for B.Ed."}</span>
                <ArrowRight size={17} className="text-gray-900" />
              </button>

              <Link
                to="/course/bed"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                <span>{isHindi ? "पाठ्यक्रम विवरण" : "Course Details"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
