import React from "react";
import { Container } from "../common/Container";
import { imageData } from "../../data/imagesData";
import { useLanguage } from "../../context/LanguageContext";
import { Quote, Sparkles, UserCheck } from "lucide-react";

const StarAlumni = () => {
  const { isHindi } = useLanguage();

  const student = {
    name: isHindi ? "पूजा शर्मा" : "Pooja Sharma",
    course: isHindi ? "बी.एड. प्रथम वर्ष" : "B.Ed. Pupil-Teacher",
    batch: isHindi ? "सत्र 2024–2026" : "Batch 2024–2026",
    image: imageData.firstYearStudent,
    quote: isHindi
      ? "हरियाणा शक्ति कॉलेज ऑफ एजुकेशन में अपनी यात्रा शुरू करना एक प्रेरक अनुभव रहा है। यहाँ के संकाय का मार्गदर्शन, शिक्षण अभ्यास और पाठ्यचर्या प्रयोगशालाएं हमें एक आत्मविश्वास से परिपूर्ण और समर्पित शिक्षक बनने के लिए सशक्त बनाती हैं।"
      : "Starting my teacher training journey at HSCE has been a truly empowering experience. The supportive faculty, hands-on micro-teaching sessions, and curriculum labs give us the pedagogical foundation and confidence to excel as future educators.",
  };

  return (
    <section className="bg-[#fafcff] py-12 font-sans sm:py-16 lg:py-20 border-t border-slate-200/80">
      <Container>
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-[34px] leading-tight">
            {isHindi ? (
              <>
                भावी शिक्षक की{" "}
                <span className="text-[#0a4b8c]">सफलता की कहानी</span>
              </>
            ) : (
              <>
                Pupil-Teacher{" "}
                <span className="text-[#0a4b8c]">Spotlight & Voice</span>
              </>
            )}
          </h2>

          <div className="mt-3.5 h-0.5 w-12 rounded-full bg-[#FBDD23]" />
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 relative">
          {/* Left Column: Image Card */}
          <div className="shrink-0 w-full lg:w-72">
            <div className="relative h-80 sm:h-96 lg:h-full w-full rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden bg-slate-100 flex items-end justify-center group">
              <img
                src={student.image}
                width="800"
                height="1000"
                alt={student.name}
                className="object-cover w-full h-full object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute top-4 left-4 z-10 rounded-full bg-[#0a4b8c] px-3 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                <UserCheck size={13} className="text-[#FBDD23]" />
                <span>{isHindi ? "प्रशिक्षित शिक्षक" : "Pupil-Teacher"}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 via-gray-950/40 to-transparent p-5 text-white">
                <h3 className="text-base font-bold text-white">{student.name}</h3>
                <p className="text-xs text-blue-200">{student.course}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Card */}
          <div className="flex-1 flex flex-col justify-center relative bg-gradient-to-br from-[#0a4b8c] via-[#094179] to-[#062c55] border border-blue-900/40 rounded-2xl p-7 sm:p-10 lg:p-12 text-white shadow-xl overflow-hidden">
            {/* Top Left Quote Icon */}
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#FBDD23]">
                <Quote size={24} className="rotate-180" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-widest text-[#FBDD23] bg-white/10 px-3 py-1 rounded-full">
                {student.batch}
              </span>
            </div>

            {/* Quote Text */}
            <blockquote className="relative z-10 text-base sm:text-lg leading-relaxed text-blue-50/95 font-normal mb-6">
              &ldquo;{student.quote}&rdquo;
            </blockquote>

            {/* Verified Student Achievement Badges (SGT Style Colorful Pills) */}
            <div className="relative z-10 mb-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isHindi ? "सीटेट उत्तीर्ण" : "CTET Cleared"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>{isHindi ? "16-सप्ताह इंटर्नशिप पूर्ण" : "16-Wk Internship"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/20 border border-blue-300/30 px-3 py-1 text-xs font-bold text-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FBDD23]" />
                <span>{isHindi ? "शिक्षक प्लेसमेंट तत्पर" : "Placement Ready"}</span>
              </span>
            </div>

            {/* Student Details */}
            <div className="relative z-10 border-t border-white/15 pt-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#FBDD23]">
                  {student.name}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">
                  {student.course} • {student.batch}
                </p>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                {isHindi ? "एचएससीई कंझावला, दिल्ली" : "HSCE Kanjhawala, Delhi"}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default StarAlumni;
