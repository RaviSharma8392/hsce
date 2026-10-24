import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { imageData, imageFallbacks } from "../../data/imagesData";
import { Container } from "../common/Container";

// ==========================================
// COLLEGE HIGHLIGHT CONTENT
// ==========================================
const highlightData = {
  tag: {
    en: "Academic Infrastructure",
    hi: "शैक्षणिक अवसंरचना",
  },

  title: {
    en: "Shaping the Teachers of Tomorrow",
    hi: "कल के शिक्षकों का निर्माण",
  },

  description: {
    en: "At Haryana Shakti College of Education (HSCE), we believe that quality education begins with dedicated teachers. Our B.Ed. programme focuses on developing teaching skills, subject knowledge, classroom understanding, and professional values to prepare aspiring educators for their teaching journey.",

    hi: "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन (HSCE) में हमारा मानना है कि गुणवत्तापूर्ण शिक्षा की शुरुआत समर्पित शिक्षकों से होती है। हमारा बी.एड. कार्यक्रम भावी शिक्षकों के शिक्षण कौशल, विषय ज्ञान, कक्षा प्रबंधन और व्यावसायिक मूल्यों को विकसित करने पर केंद्रित है।",
  },

  linkText: {
    en: "Explore B.Ed. Programme",
    hi: "बी.एड. कार्यक्रम देखें",
  },

  linkUrl: "/course/bed",

  imageUrl: imageData.campusHero,
  fallbackImage: imageFallbacks.teacherEducationHighlight,
};

// ==========================================
// HIGHLIGHT FEATURE
// ==========================================
export function HighlightFeature() {
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
          HSCE
        </span>
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-0.5 w-8 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FBDD23]">
                {isHindi ? highlightData.tag.hi : highlightData.tag.en}
              </span>
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
              {isHindi ? highlightData.title.hi : highlightData.title.en}
            </h2>

            <p className="mt-5 text-base leading-relaxed text-blue-50/90 sm:text-lg sm:leading-8 font-normal">
              {isHindi
                ? highlightData.description.hi
                : highlightData.description.en}
            </p>

            {/* Core Institutional Highlights (100% BILINGUAL) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#FBDD23] shrink-0" />
                <span>
                  {isHindi
                    ? "पाठ्यचर्या प्रयोगशालाएं एवं पुस्तकालय"
                    : "Curriculum Labs & Library"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#FBDD23] shrink-0" />
                <span>
                  {isHindi
                    ? "16 सप्ताह का स्कूल इंटर्नशिप"
                    : "16-Week School Internship"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#FBDD23] shrink-0" />
                <span>
                  {isHindi
                    ? "अनुभवी शिक्षक प्रशिक्षक संकाय"
                    : "Expert Teacher Educators"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#FBDD23] shrink-0" />
                <span>
                  {isHindi
                    ? "सीटीईटी एवं भर्ती मार्गदर्शन"
                    : "CTET & Recruitment Prep"}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={highlightData.linkUrl}
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-[#FBDD23] px-8 text-sm font-bold text-gray-900 shadow-md transition-all duration-200 hover:bg-[#ffe338] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBDD23] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a4b8c]">
                <span>
                  {isHindi
                    ? highlightData.linkText.hi
                    : highlightData.linkText.en}
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 text-gray-900"
                />
              </Link>

              <Link
                to="/about"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <span>{isHindi ? "संस्थान के बारे में" : "About HSCE"}</span>
              </Link>
            </div>
          </div>

          {/* Right: Featured Image with Badge */}
          <div className="relative w-full min-w-0 lg:col-span-6 xl:col-span-6">
            <div className="relative h-[300px] w-full min-w-0 sm:h-[380px] md:h-[440px] lg:h-[460px] overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900/40 shadow-2xl">
              <img
                src={highlightData.imageUrl}
                alt={
                  isHindi
                    ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन"
                    : "Haryana Shakti College of Education"
                }
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = highlightData.fallbackImage;
                }}
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />

              {/* Floating Stat Badge (100% BILINGUAL) */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 rounded-xl bg-gray-950/85 p-3.5 backdrop-blur-md border border-white/20 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-[#FBDD23] flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#FBDD23]" />
                  <span>
                    {isHindi
                      ? "दिल्ली एनसीटीई मान्यता प्राप्त परिसर"
                      : "Delhi NCTE Approved Campus"}
                  </span>
                </p>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-100">
                  {isHindi
                    ? "गुरु गोबिंद सिंह इंद्रप्रस्थ विश्वविद्यालय से संबद्ध"
                    : "Affiliated with Guru Gobind Singh Indraprastha University"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HighlightFeature;
