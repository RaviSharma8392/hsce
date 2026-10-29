import React from "react";
import { Container } from "../common/Container";
import { imageData } from "../../data/imagesData";
import { useLanguage } from "../../context/LanguageContext";
import { Quote, UserCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
          id="star-alumni-dots"
          x="0"
          y="0"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="72" height="54" fill="url(#star-alumni-dots)" />
    </svg>
  );
}

export function StarAlumni() {
  const { isHindi } = useLanguage();

  const student = {
    name: isHindi ? "पूजा शर्मा" : "Pooja Sharma",
    course: isHindi ? "बी.एड. छात्रा-अध्यापिका (द्वितीय वर्ष)" : "B.Ed. Pupil-Teacher (2nd Year)",
    specialization: isHindi
      ? "विज्ञान एवं गणित शिक्षण पद्धति"
      : "Pedagogy of Mathematics & Science",
    batch: isHindi ? "सत्र 2024–2026" : "Batch 2024–2026",
    college: isHindi
      ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन, कंझावला, दिल्ली"
      : "Haryana Shakti College of Education, Kanjhawala, Delhi",
    image: imageData.firstYearStudent,
    quote: isHindi
      ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में अपनी शिक्षक प्रशिक्षण यात्रा शुरू करना एक अत्यंत प्रेरक अनुभव रहा है। अनुभवी प्राध्यापकों का व्यक्तिगत मार्गदर्शन, व्यावहारिक माइक्रो-टीचिंग सत्र और समृद्ध पाठ्यचर्या प्रयोगशालाएं हमें एक आत्मविश्वास से परिपूर्ण और समर्पित शिक्षक बनने के लिए सशक्त बनाती हैं।"
      : "Starting my teacher training journey at HSCE has been a truly empowering experience. The supportive faculty, hands-on micro-teaching sessions, and curriculum labs give us the pedagogical foundation and confidence to excel as future educators.",
  };

  return (
    <section className="bg-[#EDF2F8] py-14 font-sans sm:py-16 lg:py-20 border-b border-gray-200/90 relative overflow-hidden">
      {/* Decorative Dot Matrix in Background */}
      <DotPattern className="absolute top-6 right-6 text-slate-300/80 pointer-events-none hidden sm:block" />
      <DotPattern className="absolute bottom-6 left-6 text-slate-300/80 pointer-events-none hidden sm:block" />

      <Container>
        {/* ============================================================== */}
        {/* SECTION HEADING (Matching HomeFeaturedOverview typography)      */}
        {/* ============================================================== */}
        <div className="mb-8 sm:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#FBDD23]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E3A8C]">
                {isHindi ? "विद्यार्थी अनुभव एवं विचार" : "PUPIL-TEACHER VOICE"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-[#2E3A8C] leading-tight">
              {isHindi ? "भावी शिक्षक की सफलता की कहानी" : "Pupil-Teacher Spotlight & Voice"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl">
              {isHindi
                ? "एचएसईसी में व्यावहारिक शिक्षण अभ्यास और विद्यालय इंटर्नशिप के दौरान भावी शिक्षकों के वास्तविक अनुभव।"
                : "Authentic reflections from aspiring educators undergoing practical pedagogy and school internship training at HSCE."}
            </p>
          </div>

          <Link
            to="/campus-life"
            className="group inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#2E3A8C] hover:bg-[#202965] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all">
            <span>{isHindi ? "परिसर अनुभव देखें" : "View Campus Life"}</span>
            <ArrowRight size={14} className="text-[#FBDD23]" />
          </Link>
        </div>

        {/* ============================================================== */}
        {/* SPOTLIGHT CARD: Clean, White, Elevated (Single Non-repetitive)  */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Portrait & Verified Badge */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/90 shadow-md">
                <img
                  src={student.image}
                  width="800"
                  height="1000"
                  alt={student.name}
                  className="object-cover w-full h-full object-top transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Single Verified Pill on Portrait */}
                <div className="absolute top-3 left-3 rounded-full bg-[#2E3A8C]/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5 border border-white/10">
                  <UserCheck size={13} className="text-[#FBDD23]" />
                  <span>{isHindi ? "प्रशिक्षित शिक्षक" : "Verified Trainee"}</span>
                </div>

                <div className="absolute bottom-3 right-3 rounded-md bg-[#FBDD23] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-sm">
                  {student.batch}
                </div>
              </div>
            </div>

            {/* Right Column: Quote, 3 Achievement Pills & Attribution */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Quote Icon & Batch Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E3A8C] text-[#FBDD23] shadow-xs">
                    <Quote size={20} className="rotate-180" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2E3A8C]">
                    {isHindi ? "प्रशिक्षु शिक्षक का दृष्टिकोण" : "Teacher Trainee Perspective"}
                  </span>
                </div>

                {/* Quote Body */}
                <blockquote className="italic text-base sm:text-lg lg:text-[19px] leading-relaxed text-slate-800 font-normal">
                  &ldquo;{student.quote}&rdquo;
                </blockquote>

                {/* 3 Verified Achievement Pills */}
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>{isHindi ? "सीटेट उत्तीर्ण" : "CTET Cleared"}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#2E3A8C]">
                    <CheckCircle2 size={13} className="text-[#2E3A8C]" />
                    <span>{isHindi ? "16-सप्ताह इंटर्नशिप पूर्ण" : "16-Wk Internship Delivered"}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-[#8F5E00]">
                    <CheckCircle2 size={13} className="text-[#8F5E00]" />
                    <span>{isHindi ? "शिक्षक प्लेसमेंट तत्पर" : "Placement Ready"}</span>
                  </span>
                </div>
              </div>

              {/* Single, Clear Student Attribution (No duplicate name repetition) */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    {student.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-semibold text-[#2E3A8C] mt-0.5">
                    {student.course} • {student.specialization}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {student.college}
                  </p>
                </div>

                <Link
                  to="/course/bed"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E3A8C] hover:text-[#1e255a] transition-colors">
                  <span>{isHindi ? "बी.एड. पाठ्यक्रम देखें" : "Explore B.Ed. Curriculum"}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FBDD23] text-[#2E3A8C]">
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default StarAlumni;
