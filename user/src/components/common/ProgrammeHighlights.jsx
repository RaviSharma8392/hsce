import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { Container } from "../common/Container";

// ==========================================
// DATA
// ==========================================
const highlights = [
  {
    icon: BookOpen,
    titleEn: "Teacher Education",
    titleHi: "शिक्षक प्रशिक्षण",
    descEn:
      "Build a strong understanding of classroom pedagogy, educational psychology, constitutional values and inclusive teaching.",
    descHi:
      "कक्षा शिक्षण पद्धति, शैक्षिक मनोविज्ञान, संवैधानिक मूल्यों और समावेशी शिक्षा पर विशेष ध्यान।",
  },
  {
    icon: GraduationCap,
    titleEn: "Professional Readiness",
    titleHi: "व्यावसायिक तत्परता",
    descEn:
      "Gain real classroom experience through school internships, micro-teaching and guided teaching practice.",
    descHi:
      "विद्यालय इंटर्नशिप और माइक्रो-टीचिंग के माध्यम से वास्तविक कक्षा में शिक्षण का व्यावहारिक अनुभव।",
  },
  {
    icon: Building2,
    titleEn: "Academic Environment",
    titleHi: "शैक्षणिक वातावरण",
    descEn:
      "Learn through library resources, curriculum laboratories and guidance from dedicated faculty members.",
    descHi:
      "पुस्तकालय, पाठ्यचर्या प्रयोगशालाओं और संकाय के मार्गदर्शन से सीखने का अवसर।",
  },
];

// ==========================================
// UI COMPONENT
// ==========================================
export default function ProgrammeHighlightsCard() {
  const { isHindi } = useLanguage();

  return (
    <section className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] py-14 sm:py-16 lg:py-20 font-sans text-white border-y border-blue-900/50">
      {/* Decorative wave background synced with CampusLifeSection */}
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
              d={`M ${40 + i * 8} 820 C ${
                100 + i * 12
              } ${560 - i * 5}, ${320 + i * 8} ${
                260 - i * 7
              }, ${800} ${80 + i * 12}`}
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity={0.3 + (i % 4) * 0.1}
            />
          ))}
        </svg>

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/15 sm:h-[450px] sm:w-[450px]" />
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/15 sm:h-[350px] sm:w-[350px]" />

        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-[#052243]/50" />

        <span
          className="pointer-events-none absolute bottom-6 right-8 hidden text-[110px] font-bold leading-none text-white/[0.05] lg:block xl:right-12 xl:text-[150px]">
          B.ED
        </span>
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* EYEBROW */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-0.5 w-8 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBDD23]">
                {isHindi ? "कार्यक्रम की झलकियां" : "Programme Overview"}
              </span>
            </div>

            {/* HEADING */}
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
              {isHindi ? (
                <>
                  एक सक्षम शिक्षक बनने की{" "}
                  <span className="font-bold text-[#FBDD23]">नींव</span>
                </>
              ) : (
                <>
                  Building the foundation of{" "}
                  <span className="font-bold text-[#FBDD23]">
                    great teaching
                  </span>
                </>
              )}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-50/90 sm:text-lg sm:leading-8 font-normal">
              {isHindi
                ? "सिद्धांत, व्यावहारिक अनुभव और शैक्षणिक विकास का संतुलित दृष्टिकोण जो आपको भविष्य की कक्षाओं का नेतृत्व करने के लिए तैयार करता है।"
                : "A balanced approach to educational theory, classroom practice, and professional growth designed to prepare you for the classrooms of tomorrow."}
            </p>

            {/* QUICK STATS / TRUST BULLETS (100% BILINGUAL) */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-blue-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FBDD23]" />
                <span>
                  {isHindi
                    ? "एनसीटीई अनुमोदित पाठ्यचर्या"
                    : "NCTE Approved Curriculum"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FBDD23]" />
                <span>
                  {isHindi ? "जीजीएसआईपीयू से संबद्ध" : "GGSIPU Affiliated"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FBDD23]" />
                <span>
                  {isHindi
                    ? "16 सप्ताह स्कूल इंटर्नशिप"
                    : "16-Week School Internship"}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/course/bed"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[#FBDD23] px-8 text-sm font-bold text-gray-900 shadow-md transition-all duration-200 hover:bg-[#ffe338] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a4b8c]">
                <span>{isHindi ? "पाठ्यक्रम विवरण देखें" : "View Course Details"}</span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 group-hover:translate-x-1 text-gray-900"
                />
              </Link>

              <Link
                to="/admissions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <span>{isHindi ? "प्रवेश प्रक्रिया" : "Admission Process"}</span>
              </Link>
            </div>
          </div>

          {/* RIGHT CONTENT: HIGHLIGHT CARDS */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.titleEn}
                  className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 border border-transparent hover:border-[#FBDD23]/60">
                  {/* ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a4b8c]/10 text-[#0a4b8c] transition-colors duration-300 group-hover:bg-[#0a4b8c] group-hover:text-[#FBDD23]">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#0a4b8c]">
                      {isHindi ? item.titleHi : item.titleEn}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {isHindi ? item.descHi : item.descEn}
                    </p>

                    <div className="mt-3 h-0.5 w-6 rounded-full bg-[#FBDD23] transition-all duration-300 group-hover:w-12" />
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
